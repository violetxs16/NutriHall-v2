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
        await new Promise(r => setTimeout(r, 5000));

        const className = 'shortmenurecipes';  

        const divTexts = await page.evaluate((className) => {
            const elements = document.querySelectorAll(`.${className}`);
            let dict = {};
            elements.forEach(element => {
                const text = element.textContent.trim();
                let images = [];
                let parentsSibling = element.parentElement.nextElementSibling;
                while (parentsSibling && images.length < 5){
                    const img = parentsSibling.querySelector('img');
                    const imgUrl = img.src;
                    if (imgUrl.includes('eggs')){
                        images.push('eggs');
                    }
                    if (imgUrl.includes('fish')){
                        images.push('fish');
                    }
                    if (imgUrl.includes('gluten')){
                        images.push('gluten_friendly');
                    }
                    if (imgUrl.includes('milk')){
                        images.push('milk');
                    }
                    if (imgUrl.includes('peanut')){
                        images.push('peanut');
                    }
                    if (imgUrl.includes('soy')){
                        images.push('soy');
                    }
                    if (imgUrl.includes('treenut')){
                        images.push('treenut');
                    }
                    if (imgUrl.includes('alcohol')){
                        images.push('alcohol');
                    }
                    if (imgUrl.includes('vegan')){
                        images.push('vegan');
                    }
                    if (imgUrl.includes('veggie')){
                        images.push('vegetarian');
                    }
                    if (imgUrl.includes('pork')){
                        images.push('pork');
                    }
                    if (imgUrl.includes('beef')){
                        images.push('beef');
                    }
                    if (imgUrl.includes('halal')){
                        images.push('halal');
                    }
                    if (imgUrl.includes('shellfish')){
                        images.push('shellfish');
                    }
                    if (imgUrl.includes('sesame')){
                        images.push('sesame');
                    }
                    parentsSibling = parentsSibling.nextElementSibling;
                }
                
                dict[text] = images;
            });
            return dict;
        }, className);
        dictionary = divTexts;
        console.log(dictionary);
    }

    await browser.close();
})();