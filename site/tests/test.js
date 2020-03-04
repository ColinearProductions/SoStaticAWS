const puppeteer = require('puppeteer');


//register
function register() {
    (async () => {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto('http://localhost:8080/auth/register');
        await page.type("#display_name", "Test1");
        await page.type("#email", 'test@gmail.com');
        await page.type("#password", 'fagiip[gaip[jhgfa');

        await Promise.all([page.click('#register_button'), page.waitForNavigation()]);
        // await browser.close();
    })();
}

async function login(page) {
    await page.goto('http://localhost:8080/auth/login');
    await page.type("#email", 'test@gmail.com');
    await page.type("#password", 'fagiip[gaip[jhgfa');
    await Promise.all([page.click('#login_button'), page.waitForNavigation()]);
}


//setup
(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await login(page);

    await page.goto('http://localhost:8080/setup');
    await page.type("#website_alias", 'TestWebsiteAlias');
    await page.click('#next_button');
    await page.type("#website_domains", 'localhost');
    await page.click('#next_button');
    await page.type("#contact_alias", 'SoStatic');
    await page.type("#contact_email", 'sostatic.xyz@gmail.com');

    await Promise.all([page.click('#login_button'), page.waitForNavigation()]);
    // await browser.close();
})();

