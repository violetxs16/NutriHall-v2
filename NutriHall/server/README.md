# NutriHall Web Scraper

## Overview
A web scraping service that collects UCSC dining hall menu data and stores it in Firebase. Built with Node.js, Puppeteer, and Firebase.

## Installation
```bash
npm install puppeteer firebase
```

## Configuration
### Firebase Setup
Configure Firebase credentials in `nutrition-scraper.js`:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_DOMAIN",
    databaseURL: "YOUR_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
```

## Usage
```bash
node nutrition-scraper.js
```

## Features
Scrapes all UCSC dining halls:
- John R. Lewis & College Nine
- Cowell & Stevenson
- Crown & Merrill
- Porter & Kresge
- Rachel Carson & Oakes

Collects per menu item:
- Nutritional information
- Dietary restrictions
- Ingredients
- Meal periods
- Dining hall availability

## Data Structure
```json
{
    "food": {
        "[item_name]": {
            "name": "Original item name",
            "ingredients": ["ingredient1", "ingredient2"],
            "mealPeriods": ["breakfast", "lunch", "dinner"],
            "diningHalls": ["dining_hall1", "dining_hall2"],
            "nutrition": {
                "servingSize": "3 oz",
                "calories": "250"
            },
            "restrictions": ["vegan", "gluten_friendly"]
        }
    }
}
```

## Error Handling
- Automatic retries for failed requests
- Timeout handling
- Firebase path sanitization
- Detailed error logging

## Performance
- Headless browser mode
- Resource blocking for faster loads
- Item caching
- Batch Firebase writes

## Development
Built with:
- Node.js
- Puppeteer
- Firebase Realtime Database