import puppeteer from 'puppeteer';
import fs from 'fs';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, remove, goOffline } from "firebase/database";


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


const diningHalls = {
   1: "John R. Lewis & College Nine",
   2: "Cowell & Stevenson",
   3: "Crown & Merrill",
   4: "Porter & Kresge",
   5: "Rachel Carson & Oakes"
};


// Function to clear existing data
async function clearFoodTestData() {
   return remove(ref(database, 'food'));
}


// Add nutrition data extraction function
async function extractNutritionData(page) {
   return page.evaluate(() => {
       const nutrition = {};
      
       // Get serving size and calories
       nutrition.servingSize = document.querySelector('font[size="5"]')?.textContent.split('Size')[1]?.trim() || '';
       nutrition.calories = document.querySelector('font[size="5"] b')?.textContent.split('Calories')[1]?.trim() || '';


       // Get main nutrition facts
       const nutritionRows = Array.from(document.querySelectorAll('tr'));
       nutritionRows.forEach(row => {
           const cells = row.querySelectorAll('td');
           cells.forEach(cell => {
               const text = cell.textContent.trim();
              
               // Extract values using regex
               if (text.includes('Total Fat')) {
                   nutrition.totalFat = text.match(/[\d.]+g/)?.[0] || '';
                   nutrition.totalFatDV = cell.nextElementSibling?.textContent.match(/\d+/)?.[0] || '';
               }
               if (text.includes('Sat. Fat')) {
                   nutrition.satFat = text.match(/[\d.]+g/)?.[0] || '';
                   nutrition.satFatDV = cell.nextElementSibling?.textContent.match(/\d+/)?.[0] || '';
               }
               if (text.includes('Trans Fat')) {
                   nutrition.transFat = text.match(/[\d.]+g/)?.[0] || '';
               }
               if (text.includes('Cholesterol')) {
                   nutrition.cholesterol = text.match(/[\d.]+mg/)?.[0] || '';
                   nutrition.cholesterolDV = cell.nextElementSibling?.textContent.match(/\d+/)?.[0] || '';
               }
               if (text.includes('Sodium')) {
                   nutrition.sodium = text.match(/[\d.]+mg/)?.[0] || '';
                   nutrition.sodiumDV = cell.nextElementSibling?.textContent.match(/\d+/)?.[0] || '';
               }
               if (text.includes('Tot. Carb.')) {
                   nutrition.totalCarb = text.match(/[\d.]+g/)?.[0] || '';
                   nutrition.totalCarbDV = cell.nextElementSibling?.textContent.match(/\d+/)?.[0] || '';
               }
               if (text.includes('Dietary Fiber')) {
                   nutrition.dietaryFiber = text.match(/[\d.]+g/)?.[0] || '';
                   nutrition.dietaryFiberDV = cell.nextElementSibling?.textContent.match(/\d+/)?.[0] || '';
               }
               if (text.includes('Sugars')) {
                   nutrition.sugars = text.match(/[\d.]+g/)?.[0] || '';
               }
               if (text.includes('Protein')) {
                   nutrition.protein = text.match(/[\d.]+g/)?.[0] || '';
               }
           });
       });


       // Get vitamins and minerals
       const vitamins = Array.from(document.querySelectorAll('font[size="3"]'));
       vitamins.forEach(vitamin => {
           const text = vitamin.textContent.trim();
           if (text.includes('Vitamin D')) {
               nutrition.vitaminD = text.match(/\d+%/)?.[0] || '';
           }
           if (text.includes('Calcium')) {
               nutrition.calcium = text.match(/\d+%/)?.[0] || '';
           }
           if (text.includes('Iron')) {
               nutrition.iron = text.match(/\d+%/)?.[0] || '';
           }
           if (text.includes('Potassium')) {
               nutrition.potassium = text.match(/\d+%/)?.[0] || '';
           }
       });


       // Extract dietary tags
       const tags = [];
       const labelSpan = document.querySelector('.labelwebcodesvalue');
       if (labelSpan) {
           const images = labelSpan.querySelectorAll('img');
           images.forEach(img => {
               const imgUrl = img.src;
               if (imgUrl.includes('eggs')) tags.push('eggs');
               if (imgUrl.includes('fish')) tags.push('fish');
               if (imgUrl.includes('gluten')) tags.push('gluten_friendly');
               if (imgUrl.includes('milk')) tags.push('milk');
               if (imgUrl.includes('peanut')) tags.push('peanut');
               if (imgUrl.includes('soy')) tags.push('soy');
               if (imgUrl.includes('treenut')) tags.push('treenut');
               if (imgUrl.includes('alcohol')) tags.push('alcohol');
               if (imgUrl.includes('vegan')) tags.push('vegan');
               if (imgUrl.includes('veggie')) tags.push('vegetarian');
               if (imgUrl.includes('pork')) tags.push('pork');
               if (imgUrl.includes('beef')) tags.push('beef');
               if (imgUrl.includes('halal')) tags.push('halal');
               if (imgUrl.includes('shellfish')) tags.push('shellfish');
               if (imgUrl.includes('sesame')) tags.push('sesame');
           });
       }

       nutrition.tags = tags;
       return nutrition;
   });
}


// Add sanitize function
function sanitizeFirebasePath(path) {
   return path
       .replace(/\./g, '_')  // Replace dots with underscores
       .replace(/[\/#\[\]$]/g, '_')  // Replace other invalid chars
       .trim();
}


// Update writeFoodData function
async function writeFoodData(itemName, itemData) {
   try {
       const sanitizedName = sanitizeFirebasePath(itemName);
       await set(ref(database, 'food/' + sanitizedName), {
           name: itemName,  // Keep original name in data
           ingredients: itemData.ingredients,
           mealPeriods: itemData.mealPeriods,
           diningHalls: itemData.diningHalls,
           nutrition: itemData.nutrition,
           restrictions: itemData.nutrition.tags || [] // Add tags to Firebase data
       });
       console.log(`Wrote data for ${itemName}`);
   } catch (error) {
       console.error(`Failed to write data for ${itemName}:`, error);
   }
}


(async () => {
   // Clear existing data before browser launch
   await clearFoodTestData();


   // Update main scraping loop with proper wait mechanisms
   const browser = await puppeteer.launch({
       headless: true,
       defaultViewport: false,
       userDataDir: "./tmp"
   });


   const page = await browser.newPage();
   let dictionary = {};  // Store menu items with ingredients and meal period


   // Iterate through each dining hall (1-5)
   for (let i = 1; i <= 5; i++) {
       try {
           // Navigate and wait for content
           await Promise.all([
               page.waitForNavigation({ waitUntil: 'networkidle0' }),
               page.goto('https://nutrition.sa.ucsc.edu/location.aspx')
           ]);


           // Click dining hall and wait for load
           await Promise.all([
               page.waitForNavigation({ waitUntil: 'networkidle0' }),
               page.click('#locationchoices > ul > li:nth-child(' + i + ') > a')
           ]);


           // Meal period loop
           for (let menuTab = 1; menuTab <= 3; menuTab++) {
               const mealPeriod = menuTab === 1 ? 'breakfast' :
                                 menuTab === 2 ? 'lunch' : 'dinner';


               try {
                   await page.waitForSelector('span.shortmenunutritive', {
                       visible: true,
                       timeout: 5000
                   });


                   const spans = await page.$$('span.shortmenunutritive');
                   if (spans.length >= menuTab) {
                       await Promise.all([
                           page.waitForNavigation({ waitUntil: 'networkidle0' }),
                           spans[menuTab - 1].click()
                       ]);
                   } else {
                       console.log(`No ${mealPeriod} menu found`);
                       continue;
                   }


                   // Extract menu items and their selectors
                   const menuItems = await page.evaluate(() => {
                       // Helper function to generate unique CSS selector for elements
                       const getSelector = (el) => {
                           if (!(el instanceof Element)) return '';
                           // Get element's position among siblings
                           const idx = Array.from(el.parentNode.children).indexOf(el) + 1;
                           const parentSelector = getSelector(el.parentNode);
                          
                           // Build selector for current element
                           const currentSelector = `${el.tagName.toLowerCase()}:nth-child(${idx})`;
                           if (!parentSelector) return currentSelector;
                          
                           // Combine selectors and trim from 'body'
                           const fullSelector = `${parentSelector} > ${currentSelector}`;
                           const bodyIndex = fullSelector.indexOf('body');
                           return bodyIndex !== -1 ? fullSelector.slice(bodyIndex) : fullSelector;
                       };


                       // Get all menu item names and their selectors
                       return Array.from(document.querySelectorAll('.longmenucoldispname')).map((item) => ({
                           name: item.textContent.trim(),
                           selector: getSelector(item) + '> a'
                       }));
                   });


                   // Process each menu item
                   for (const item of menuItems) {
                       const { name: itemName, selector } = item;
                       await page.waitForSelector(selector, { timeout: 5000 });  // Ensure element is loaded
                       await page.click(selector);  // Click to view details
                       await new Promise(r => setTimeout(r, 1000));


                       // Extract ingredients list
                       const ingredients = await page.evaluate(() => {
                           return Array.from(document.querySelectorAll('.labelingredientsvalue'))
                               .map(ingredient => ingredient.textContent.trim());
                       });


                       // Update dictionary assignment in the scraping loop
                       if (dictionary[itemName]) {
                           // If item exists, add new meal period if not already present
                           if (!dictionary[itemName].mealPeriods.includes(mealPeriod)) {
                               dictionary[itemName].mealPeriods.push(mealPeriod);
                           }
                           // Add new dining hall if not already present
                           if (!dictionary[itemName].diningHalls.includes(diningHalls[i])) {
                               dictionary[itemName].diningHalls.push(diningHalls[i]);
                           }
                           // Add nutrition data
                           dictionary[itemName].nutrition = await extractNutritionData(page);
                       } else {
                           // If new item, initialize with first meal period and dining hall
                           dictionary[itemName] = {
                               ingredients: ingredients,
                               mealPeriods: [mealPeriod],
                               diningHalls: [diningHalls[i]],
                               nutrition: await extractNutritionData(page)
                           };
                       }


                       await page.goBack();  // Return to menu page
                   }


                   // Navigate back if not on last meal period
                   if (menuTab < 3) {
                       await page.goBack();
                       await new Promise(r => setTimeout(r, 500));
                   }
               } catch (error) {
                   console.error(`Failed to process ${mealPeriod} menu:`, error);
                   continue;
               }
           }
           // Log collected data for current dining hall
           console.log(dictionary);


           // Write data to Firebase
           for (const [itemName, itemData] of Object.entries(dictionary)) {
               await writeFoodData(itemName, itemData);
           }
       } catch (error) {
           console.error('Failed to load page:', error);
           // Handle error
       }
   }


   // Close browser when done
   await browser.close();
   goOffline(database);
})();