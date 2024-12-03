import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, query, orderByChild, equalTo, get, set } from 'firebase/database';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyCPNNVBuaWPm7-JaqFtmFA1P_pWJi6ifHQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

const RecordMeal = () => {
  const [user] = useAuthState(auth);
  const [meal, setMeal] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [food, setFood] = useState(null);
  const [foodData, setFoodData] = useState({});
  const [recordedItems, setRecordedItems] = useState(new Set()); // Track recorded items

  useEffect(() => {
    const fetchPreferences = async (uid) => {
      try {
        const preferencesRef = ref(database, `users/${uid}/preferences`);
        const snapshot = await get(preferencesRef);

        if (snapshot.exists()) {
          setPreferences(snapshot.val());
        } else {
          console.log('No preferences found for this user.');
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
    }

    if (user) {
      fetchPreferences(user.uid);
      fetchFood();
    }
  }, [user]);

  const sanitizeKey = (key) => key.replace(/[^a-zA-Z0-9_-]/g, '_');

  const handleRecordMeal = async (foodName) => {
    if (!user) {
      alert('Please log in to record meals.');
      return;
    }

    // Find closest matching food item in database
    const matchingFood = Object.entries(foodData).find(([key]) => 
      key.toLowerCase().includes(foodName.toLowerCase())
    );

    if (!matchingFood) {
      alert(`Could not find "${foodName}" in our database`);
      return;
    }

    const [exactName, item] = matchingFood;

    try {
      const timestamp = Date.now();
      const diaryRef = ref(database, `users/${user.uid}/diary/${sanitizeKey(exactName)}_${timestamp}`);
      const historyRef = ref(database, `users/${user.uid}/history/${sanitizeKey(exactName)}_${timestamp}`);
      
      const newEntry = {
        ...item,
        recordedAt: new Date().toISOString(),
      };

      await Promise.all([
        set(diaryRef, newEntry),
        set(historyRef, newEntry)
      ]);

      // Mark item as recorded
      setRecordedItems(prev => new Set([...prev, foodName]));
      alert('Meal recorded successfully!');
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
            const match = item.trim().match(/^\s*(\D*):([^\n]*)/);
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
    if (!user || !preferences) {
      console.log('User or preferences not available.');
      return;
    }

    setLoading(true);

    try {
      const prompt = `
        Generate a personalized meal plan based on the following details:
        - Dietary restrictions: ${Object.keys(preferences.dietaryRestrictions).filter((key) => preferences.dietaryRestrictions[key]).join(', ') || 'none'}
        - Calorie range: ${preferences.calorieRange || 'any'}
        - Foods available today: ${food || 'none'}

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

      const mealPlan = parseMealPlan(response.response.candidates[0].content.parts[0].text);
      console.log('Parsed meal plan:', mealPlan);

      // Save the meal plan to local storage
      localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
      setMeal(mealPlan || 'No meal plan generated.');
    } catch (error) {
      console.error('Error generating meal plan with Gemini API:', error);
      setMeal('An error occurred while generating the meal plan.');
    } finally {
      setLoading(false);
    }
  };

  const renderMealItem = (item, index) => {
    const isRecorded = recordedItems.has(item.food);
    const foodExists = Object.keys(foodData).some(key => 
      key.toLowerCase().includes(item.food.toLowerCase())
    );

    return (
      <li key={index} className="flex items-center justify-between mb-2 p-2 border rounded">
        <div>
          <span className="font-medium">{item.food}</span>
          <span className="text-gray-600 ml-2">({item.quantity})</span>
        </div>
        {foodExists ? (
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
          <span className="text-red-500 text-sm">Not available</span>
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
          >
            Generate Meal Plan
          </button>
          {meal && (
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-4">Generated Meal Plan</h2>
              <div className="meal-plan space-y-6">
                {['Breakfast', 'Lunch', 'Dinner'].map((mealType) => (
                  <div key={mealType} className="bg-white p-4 rounded-lg shadow">
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
