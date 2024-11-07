// src/components/Preferences.jsx
import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebaseConfig';
import { ref, onValue, set } from 'firebase/database';
import { calculateCalorieRange } from '../utils/calorieCalculator';

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    dietaryRestrictions: {},
    calorieRange: 2000,
    goal: 'default', // 'cut', 'default', 'bulk'
  });

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      // Fetch accountInfo to get weight, height, sex, age
      const accountRef = ref(database, `users/${user.uid}/accountInfo`);
      onValue(accountRef, (snapshot) => {
        const accountData = snapshot.val();
        if (accountData) {
          const { weight, height, sex, age } = accountData;
          const calculatedCalories = calculateCalorieRange(
            weight,
            height,
            sex,
            preferences.goal,
            age
          );
          setPreferences((prev) => ({
            ...prev,
            calorieRange: calculatedCalories,
          }));
        }
      });
    }
  }, [user, preferences.goal]);
  

  useEffect(() => {
    if (user) {
      // Fetch preferences
      const prefsRef = ref(database, `users/${user.uid}/preferences`);
      onValue(prefsRef, (snapshot) => {
        const prefsData = snapshot.val();
        if (prefsData) {
          setPreferences(prefsData);
        }
      });
    }
  }, [user]);
  

  const dietaryOptions = [
    'vegan',
    'soy',
    'gluten',
    'alcoholic',
    'beef',
    'eggs',
    'fish',
    'halal',
    'milk',
    'nuts',
    'pork',
    'sesame',
    'shellfish',
    'treenut',
    'veggie',
  ];

  const handleToggle = (option) => {
    setPreferences((prev) => ({
      ...prev,
      dietaryRestrictions: {
        ...prev.dietaryRestrictions,
        [option]: !prev.dietaryRestrictions[option],
      },
    }));
  };

  const handleSave = () => {
    const prefsRef = ref(database, `users/${user.uid}/preferences`);
    set(prefsRef, preferences)
      .then(() => {
        alert('Preferences saved!');
      })
      .catch((error) => {
        console.error('Error saving preferences:', error);
      });
  };
  

  return (
    <div>
      <h2 className="text-xl mb-4">Preferences</h2>
      <div className="mb-6">
        <h3 className="mb-2">Dietary Restrictions:</h3>
        <div className="grid grid-cols-2 gap-4">
          {dietaryOptions.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.dietaryRestrictions[option] || false}
                onChange={() => handleToggle(option)}
                className="mr-2"
              />
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2">Calorie Range:</label>
        <input
          type="number"
          value={preferences.calorieRange}
          onChange={(e) =>
            setPreferences((prev) => ({
              ...prev,
              calorieRange: parseInt(e.target.value) || 0,
            }))
          }
          className="border px-3 py-2 rounded w-full"
        />
      </div>

      <div className="mb-6">
        <h3 className="mb-2">Goal:</h3>
        <div className="flex space-x-4">
          {['cut', 'default', 'bulk'].map((goalOption) => (
            <button
              key={goalOption}
              onClick={() =>
                setPreferences((prev) => ({ ...prev, goal: goalOption }))
              }
              className={`px-4 py-2 rounded ${
                preferences.goal === goalOption
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {goalOption.charAt(0).toUpperCase() + goalOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Save Preferences
      </button>
    </div>
  );
};

export default Preferences;
