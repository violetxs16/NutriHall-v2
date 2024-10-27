import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, goOffline } from "firebase/database";
import puppeteer from 'puppeteer';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDg1AXQ-uy1YSMH9cs8_KPutnls1efHEwQ",
  authDomain: "nutrihall-26949.firebaseapp.com",
  databaseURL: "https://nutrihall-26949-default-rtdb.firebaseio.com",
  projectId: "nutrihall-26949",
  storageBucket: "nutrihall-26949.appspot.com",
  messagingSenderId: "561607807866",
  appId: "1:561607807866:web:f0d779706806f698e6fcc3",
  measurementId: "G-V8C0DHE8Y3"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function writeFoodData(mealName) {
    return set(ref(database, 'food/' + mealName), {
        name: mealName
    });
}  

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp"
    });
    const page = await browser.newPage();

    await page.goto('https://nutrition.sa.ucsc.edu/location.aspx');
    await new Promise(r => setTimeout(r, 3000));
    page.click('#locationchoices > ul > li:nth-child(1) > a');
    await new Promise(r => setTimeout(r, 3000));

    const className = 'shortmenurecipes';  

    const divTexts = await page.evaluate((className) => {
        const elements = document.querySelectorAll(`.${className}`);
        
        return Array.from(elements).map(element => element.textContent.trim());
    }, className);
    console.log(divTexts);
    await browser.close();

    const writeOperations = divTexts.map(text => writeFoodData(text))
    await Promise.all(writeOperations);
    goOffline(database);
})();
