const puppeteer = require('puppeteer');
const fs = require('fs');

class FBService {
    async main() {
        const browser = await puppeteer.launch({
            args: ['--deny-permission-prompts'],
            // debug options
            // args: ['--deny-permission-prompts', `--window-size=1920,1080`],
            // headless: false,
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
        await page.goto('https://www.facebook.com/groups/257393997640502');
        page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
        const feedsData = await page.evaluate(this.findFeedsContent);

        fs.writeFileSync('./services/.txt', feedsData);

        await browser.close();
    }

    async browserLoginFB({ email, pwd }) {
        document.querySelector('#email').value = email;
        document.querySelector('#pass').value = pwd;
        const btnList = document.querySelectorAll('#content form button');
        const loginBtn = btnList[btnList.length - 1];
        loginBtn.dispatchEvent(new MouseEvent('click'));
    }

    async findFeedsContent() {
        function findArticleEl(el) {
            return el.querySelector('div[role=article] div[id]');
        }
        try {
            const feeds = document.querySelectorAll('[role=feed] > div > div');
            const contentEl = findArticleEl(feeds[1]);
            const moreBtn = contentEl.querySelector('[role=button]');
            if (moreBtn) {
                moreBtn.click();
            }
            await new Promise((r) => {
                setTimeout(r, 0);
            });
            return contentEl.outerHTML;
        } catch (error) {
            return error.message;
        }
    }
}

new FBService().main();
