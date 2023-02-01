const puppeteer = require('puppeteer');

async function getJobList(query) {
    const jobListUrl = new URL('https://www.104.com.tw/jobs/search/list');
    jobListUrl.search = query;
    jobListUrl.searchParams.set('page', 1);
    const res = await fetch(jobListUrl.toString());

    const data = await res.json();
    return data.data.list;
}

module.exports = {
    async getJobList(query) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://www.104.com.tw/jobs/main/');

        const jobList = await page.evaluate(getJobList, query);

        await browser.close();

        return jobList;
    },
};
