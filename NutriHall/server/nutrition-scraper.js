const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp"
    });
    const page = await browser.newPage()
    let dictionary = {};
    for (let i = 1; i <= 5; i++){
        await page.goto('https://nutrition.sa.ucsc.edu/location.aspx');
        await new Promise(r => setTimeout(r, 500));
        page.click('#locationchoices > ul > li:nth-child(' + i + ') > a');
        await new Promise(r => setTimeout(r, 500));
        page.click('.shortmenunutritive')
        await new Promise(r => setTimeout(r, 1500));

        const menuItems = await page.evaluate(() => {
            
            const getSelector = (el) => {
                if (!(el instanceof Element)) return '';
                const idx = Array.from(el.parentNode.children).indexOf(el) + 1;
                const parentSelector = getSelector(el.parentNode);
                
                // Build the selector for the current element
                const currentSelector = `${el.tagName.toLowerCase()}:nth-child(${idx})`;

                // If parentSelector is empty, return the currentSelector
                if (!parentSelector) return currentSelector;

                // Combine and find the position of 'body'
                const fullSelector = `${parentSelector} > ${currentSelector}`;
                const bodyIndex = fullSelector.indexOf('body');

                // Return the trimmed selector starting from 'body'
                return bodyIndex !== -1 ? fullSelector.slice(bodyIndex) : fullSelector;
            };
            return Array.from(document.querySelectorAll('.longmenucoldispname')).map((item) => ({
                name: item.textContent.trim(),
                selector: getSelector(item) + '> a'
            }));
        });
        for (const item of menuItems){
            const { name: itemName, selector } = item;
            await page.waitForSelector(selector);
            await page.click(selector);
            await new Promise(r => setTimeout(r, 1000));

            const ingredients = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.labelingredientsvalue')).map(ingredient => ingredient.textContent.trim());
            });

            dictionary[itemName] = ingredients

            await page.goBack();
        }

        console.log(dictionary);
    }

    await browser.close();
})();