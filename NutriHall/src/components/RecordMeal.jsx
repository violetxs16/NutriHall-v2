import React, { useContext, useState, useEffect } from 'react';
import { auth, database } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, get, set } from 'firebase/database';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Fuse from 'fuse.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { ThemeContext } from '../contexts/ThemeContext';

const genAI = new GoogleGenerativeAI("AIzaSyCPNNVBuaWPm7-JaqFtmFA1P_pWJi6ifHQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

const RecordMeal = () => {
  const [user, loadingAuth, errorAuth] = useAuthState(auth);
  const [meal, setMeal] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [food, setFood] = useState(null);
  const [foodData, setFoodData] = useState({});
  const [recordedItems, setRecordedItems] = useState(new Set()); // Track recorded items
  const [fuse, setFuse] = useState(null); // Initialize Fuse.js instance
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchPreferences = async (uid) => {
      try {
        const preferencesRef = ref(database, `users/${uid}/preferences`);
        const snapshot = await get(preferencesRef);

        if (snapshot.exists()) {
          console.log('Preferences fetched:', snapshot.val());
          setPreferences(snapshot.val());
        } else {
          console.log('No preferences found for this user.');
          setPreferences(null); // Explicitly set to null
        }
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    const fetchFood = async () => {
      try {
        const foodRef = ref(database, 'food');
        const snapshot = await get(foodRef);

        if (snapshot.exists()) {
          const foodItems = snapshot.val();
          setFoodData(foodItems);
          setFood(Object.keys(foodItems));
          console.log('Food data fetched:', foodItems);

          // Initialize Fuse.js with foodData
          const options = {
            keys: ['name'], // Specify the key to search in
            threshold: 0.3, // Adjust the threshold for matching (0.0 = exact match, 1.0 = match anything)
          };
          const fuseInstance = new Fuse(Object.values(foodItems), options);
          setFuse(fuseInstance);
        } else {
          console.log('No food exists');
        }
      } catch (error) {
        console.error('Error fetching food:', error);
      }
    };

    // Check local storage for an existing meal plan
    const savedMeal = localStorage.getItem('mealPlan');
    if (savedMeal) {
      setMeal(JSON.parse(savedMeal));
      console.log('Loaded saved meal plan from localStorage.');
    }

    if (user) {
      fetchPreferences(user.uid);
      fetchFood();
    } else {
      setPreferences(null);
      setFoodData({});
      setFood(null);
      console.log('No user is logged in.');
    }
  }, [user]);

  const sanitizeKey = (key) => key.replace(/[^a-zA-Z0-9_-]/g, '_');

  const handleRecordMeal = async (foodName) => {
    if (!user) {
      // User should already be logged in to see the Record button, but just in case
      return;
    }

    if (!fuse) {
      // Food data is not loaded yet
      return;
    }

    // Use Fuse.js to find the best match
    const results = fuse.search(foodName);
    if (results.length === 0) {
      // No match found, ideally this shouldn't happen due to the "Search Menu" option
      return;
    }

    // Get the best match (first result)
    const bestMatch = results[0].item;
    const exactName = bestMatch.name; // Assuming each food item has a 'name' property

    try {
      const timestamp = Date.now();
      const sanitizedName = sanitizeKey(exactName);
      const diaryRef = ref(database, `users/${user.uid}/diary/${sanitizedName}_${timestamp}`);
      const historyRef = ref(database, `users/${user.uid}/history/${sanitizedName}_${timestamp}`);
      
      const newEntry = {
        ...bestMatch,
        recordedAt: new Date().toISOString(),
      };

      await Promise.all([
        set(diaryRef, newEntry),
        set(historyRef, newEntry)
      ]);

      // Mark item as recorded
      setRecordedItems(prev => new Set([...prev, exactName]));
      // Removed alert for success
    } catch (error) {
      console.error('Error recording meal:', error);
      alert('Failed to record meal');
    }
  };

  const parseMealPlan = (mealPlanText) => {
    const meals = {
      Breakfast: [],
      Lunch: [],
      Dinner: []
    };

    const lines = mealPlanText.trim().split('\n');
    let currentMeal = null;

    lines.forEach(line => {
      if (/^Breakfast:/.test(line)) {
        currentMeal = 'Breakfast';
      } else if (/^Lunch:/.test(line)) {
        currentMeal = 'Lunch';
      } else if (/^Dinner:/.test(line)) {
        currentMeal = 'Dinner';
      } else {
        if (currentMeal) {
          const foodItems = line.split(';').map(item => {
            const match = item.trim().match(/^\s*(.+?):\s*(.+)$/);
            if (match) {
              return {
                food: match[1].trim(),
                quantity: match[2].trim(),
              };
            }
            return null;
          }).filter(Boolean);

          if (foodItems.length > 0) {
            meals[currentMeal] = [...meals[currentMeal], ...foodItems];
          }
        }
      }
    });

    return meals;
  };

  const generateMeal = async () => {
    if (loadingAuth) {
      console.log('Authentication state is loading...');
      return;
    }

    if (errorAuth) {
      console.error('Authentication error:', errorAuth);
      alert('Authentication error. Please try again.');
      return;
    }

    if (!user || !preferences) {
      console.log('User or preferences not available.');
      alert('User or preferences not available. Please ensure you are logged in and have set your preferences.');
      return;
    }

    setLoading(true);

    try {
      const dietaryRestrictions = preferences.dietaryRestrictions
        ? Object.keys(preferences.dietaryRestrictions).filter(key => preferences.dietaryRestrictions[key]).join(', ')
        : 'none';
      const calorieRange = preferences.calorieRange || 'any';
      const availableFoods = food || 'none';

      const prompt = `
        Generate a personalized meal plan based on the following details:
        - Dietary restrictions: ${dietaryRestrictions}
        - Calorie range: ${calorieRange}
        - Foods available today: ${availableFoods}

        Provide a meal plan with breakfast, lunch, and dinner.
        Return a response in the following format:
        Breakfast: 
        food1:quantity; food2:quantity
        Lunch: 
        food1:quantity; food2:quantity
        Dinner: 
        food1:quantity; food2:quantity
      `;

      const response = await model.generateContent(prompt);
      console.log('Response from Gemini API:', response);

      // Adjust according to actual response structure
      const mealPlanText = response.response.candidates[0].content.parts[0].text;
      const mealPlan = parseMealPlan(mealPlanText);
      console.log('Parsed meal plan:', mealPlan);

      // Save the meal plan to local storage
      localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
      setMeal(mealPlan || 'No meal plan generated.');
    } catch (error) {
      console.error('Error generating meal plan with Gemini API:', error);
      setMeal('An error occurred while generating the meal plan.');
      alert('An error occurred while generating the meal plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchMenu = (foodName) => {
    // Navigate to the menu page with a search query parameter
    // Assuming your menu route is '/menu' and it accepts a 'search' query parameter
    navigate(`/menu?search=${encodeURIComponent(foodName)}`);
  };

  const renderMealItem = (item, index) => {
    const isRecorded = recordedItems.has(item.food);
    // Use exact name matching since Fuse.js handles similarity
    const foodExists = Object.keys(foodData).includes(item.food) || recordedItems.has(item.food);

    // Fuzzy search to check if the item exists
    const results = fuse ? fuse.search(item.food) : [];
    const bestMatch = results.length > 0 ? results[0].item.name : null;
    const exactMatch = foodData[item.food] ? item.food : bestMatch;

    const isAvailable = exactMatch && foodData[exactMatch];

    return (
      <li key={index} className="flex items-center justify-between mb-2 p-2 border rounded">
        <div>
          <span className="font-medium">{item.food}</span>
          <span className="text-gray-600 ml-2">({item.quantity})</span>
        </div>
        {isAvailable ? (
          <button
            onClick={() => handleRecordMeal(item.food)}
            disabled={isRecorded}
            className={`ml-4 px-3 py-1 rounded ${
              isRecorded 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isRecorded ? 'Recorded' : 'Record'}
          </button>
        ) : (
          <button
            onClick={() => handleSearchMenu(item.food)}
            className="ml-4 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Search Menu
          </button>
        )}
      </li>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Record Meal</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <button
            onClick={generateMeal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            disabled={!user || !preferences || loadingAuth}
          >
            Generate Meal Plan
          </button>
          {meal && (
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-4">Generated Meal Plan</h2>
              <div className="meal-plan space-y-6">
                {['Breakfast', 'Lunch', 'Dinner'].map((mealType) => (
                  <div key={mealType} className={`p-4 rounded-lg shadow ${theme === 'mytheme' ? 'bg-white' : 'bg-zinc-900'}`}>
                    <h3 className="text-lg font-semibold mb-3">{mealType}</h3>
                    <ul className="space-y-2">
                      {meal[mealType].map((item, index) => renderMealItem(item, index))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecordMeal;
