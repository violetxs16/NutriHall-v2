import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyCPNNVBuaWPm7-JaqFtmFA1P_pWJi6ifHQ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

const RecordMeal = () => {
  const [user] = useAuthState(auth);
  const [meal, setMeal] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [acctInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [food, setFood] = useState(null);

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

    const fetchAccountInfo = async (uid) => {
      try {
        const infoRef = ref(database, `users/${uid}/accountInfo`);
        const snapshot = await get(infoRef);

        if (snapshot.exists()) {
          setAccountInfo(snapshot.val());
        } else {
          console.log('No info found for this user.');
        }
      } catch (error) {
        console.error('Error fetching info:', error);
      }
    };

    const fetchFood = async () => {
      try {
        const foodRef = ref(database, 'food');
        const queryRef = query(foodRef, orderByChild('diningHalls'), equalTo('Cowell & Stevenson'));
        const snapshot = await get(foodRef);

        if (snapshot.exists()) {
          setFood(Object.keys(snapshot.val()));
        } else {
          console.log('No food exists');
        }
      } catch (error) {
        console.error('Error fetching food:', error);
      }
    };

    if (user) {
      fetchPreferences(user.uid);
      fetchAccountInfo(user.uid);
      fetchFood();
    }
  }, [user]);

  const parseMealPlan = (mealPlanText) => {
    const meals = {
      Breakfast: [],
      Lunch: [],
      Dinner: []
    };

    const lines = mealPlanText.trim().split('\n');
    let currentMeal = null;

    // Debug: Log the raw response to ensure it's being received correctly
    console.log('Raw meal plan text:', mealPlanText);

    lines.forEach(line => {
      if (/^Breakfast:/.test(line)) {
        currentMeal = 'Breakfast';
      } else if (/^Lunch:/.test(line)) {
        currentMeal = 'Lunch';
      } else if (/^Dinner:/.test(line)) {
        currentMeal = 'Dinner';
      } else {
        // Parse food items with their quantities
        if (currentMeal) {
          const foodItems = line.split(',').map(item => {
            // Regex to match food items and quantities, including units like "g", "cup", "tbsp"
            const match = item.trim().match(/^(.+?)(?::\s*(\d+[\w\s]*))?$/);
            if (match) {
              return {
                food: match[1].trim(),
                quantity: match[2] ? match[2].trim() : '1', // Default to 1 if no quantity is provided
              };
            }
            return null;
          }).filter(Boolean); // Remove null items

          if (foodItems.length > 0) {
            meals[currentMeal] = [...meals[currentMeal], ...foodItems];
          }
        }
      }
    });

    return meals;
  };

  const generateMeal = async () => {
    if (!user || !preferences || !acctInfo) {
      console.log('User or preferences/account info not available.');
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
        food1:quantity, food2:quantity
        Lunch: 
        food1:quantity, food2:quantity
        Dinner: 
        food1:quantity, food2:quantity
      `;

      const response = await model.generateContent(prompt);
      console.log('Response from Gemini API:', response);

      // Parse the meal plan
      const mealPlan = parseMealPlan(response.response.candidates[0].content.parts[0].text);
      console.log('Parsed meal plan:', mealPlan);

      setMeal(mealPlan || 'No meal plan generated.');
    } catch (error) {
      console.error('Error generating meal plan with Gemini API:', error);
      setMeal('An error occurred while generating the meal plan.');
    } finally {
      setLoading(false);
    }
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Generate Meal
          </button>
          {meal && (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Generated Meal Plan:</h2>
              <div className="meal-plan">
                {['Breakfast', 'Lunch', 'Dinner'].map((mealType) => (
                  <div key={mealType}>
                    <h3 className="text-lg font-semibold">{mealType}</h3>
                    <ul>
                      {meal[mealType].map((item, index) => (
                        <li key={index}>
                          {item.food}: {item.quantity}
                        </li>
                      ))}
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
