const puppeteer = require('puppeteer');
const fs = require('fs');
const cheerio = require('cheerio');

class FBService {
    async main() {
        const strs = await this.fetchPosts(
            'https://www.facebook.com/groups/257393997640502',
            10
        );

        const texts = strs
            .filter(Boolean)
            .map((str) => cheerio.load(str).text());

        fs.writeFileSync(
            'services/posts.json',
            JSON.stringify({
                posts: texts,
            })
        );
    }

    async fetchPosts(
        groupPageUrl = 'https://www.facebook.com/groups/257393997640502',
        postCount = 100
    ) {
        const browser = await puppeteer.launch({
            args: ['--deny-permission-prompts'],
            // debug options
            // headless: false,
            // args: ['--deny-permission-prompts', `--window-size=1920,1080`],
            // defaultViewport: {
            //     width: 1920,
            //     height: 1080,
            // },
        });
        const page = await browser.newPage();

        await page.goto('https://www.facebook.com/');
        await page.evaluate(this.browserLoginFB, {
            email: process.env.FB_USERNAME,
            pwd: process.env.FB_PASSWORD,
        });
        await page.waitForNavigation();

        await page.goto(groupPageUrl);
        const posts = await page.evaluate(this.findPostsContent, postCount);

        await browser.close();

        return posts;
    }

    async browserLoginFB({ email, pwd }) {
        document.querySelector('#email').value = email;
        document.querySelector('#pass').value = pwd;
        const btnList = document.querySelectorAll('#content form button');
        const loginBtn = btnList[btnList.length - 1];
        loginBtn.dispatchEvent(new MouseEvent('click'));
    }

    async findPostsContent(num = 0) {
        async function waitUntil(fn, { maxTimes = 10, duration = 500 } = {}) {
            let waitingTimes = 0;
            let result = false;

            while (waitingTimes < maxTimes) {
                await new Promise((r) => {
                    setTimeout(r, duration);
                });

                result = fn();

                if (result) {
                    break;
                } else {
                    waitingTimes += 1;
                }
            }

            return result;
        }
        function findAllPosts() {
            return document.querySelectorAll('[role=feed] > div > div');
        }
        function findPostContent(el) {
            return el.querySelector('div[role=article] div[id]');
        }
        async function loadNewPosts() {
            const wait = 500;
            const maxWaitTimes = 3;

            const originPost = findAllPosts();
            let posts = originPost;
            let waitTimes = 0;
            let isLoad = false;

            window.scrollTo(0, 100000);

            while (waitTimes < maxWaitTimes) {
                await new Promise((r) => {
                    setTimeout(r, wait);
                });

                posts = findAllPosts();
                if (posts.length > originPost.length) {
                    isLoad = true;
                    break;
                } else {
                    waitTimes += 1;
                }
            }

            return isLoad && posts;
        }
        try {
            let postsContent = [];
            let posts = findAllPosts();

            for (let i = 1; i <= num; i++) {
                let post = posts[i];
                if (!post) {
                    const newPosts = await loadNewPosts();
                    if (newPosts) {
                        posts = newPosts;
                        post = newPosts[i];
                    } else {
                        break;
                    }
                }
                window.scrollTo(
                    0,
                    window.scrollY + post.getBoundingClientRect().top
                );

                const contentEl = await waitUntil(() => {
                    posts = findAllPosts();
                    post = posts[i];
                    return findPostContent(post);
                });

                if (contentEl) {
                    const moreBtn = contentEl.querySelector('[role=button]');
                    if (moreBtn) {
                        moreBtn.click();
                    }
                    await new Promise((r) => {
                        setTimeout(r, 0);
                    });
                    postsContent.push(contentEl.outerHTML);
                } else {
                    postsContent.push(null);
                }
            }
            return postsContent;
        } catch (error) {
            return error.message;
        }
    }
}

module.exports = new FBService();
