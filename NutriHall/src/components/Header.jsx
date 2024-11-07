// src/components/Header.jsx
import React, { useContext } from 'react';
import UserProfile from './UserProfile';
import { PreferencesContext } from '../contexts/PreferencesContext';

const Header = () => {
  const { temporaryPreferences, setTemporaryPreferences } = useContext(PreferencesContext);

  const dietaryOptions = [
    'vegan',
    'soy',
    'gluten',
    'alcohol',
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
    setTemporaryPreferences((prev) => ({
      ...prev,
      dietaryRestrictions: {
        ...prev.dietaryRestrictions,
        [option]: !prev.dietaryRestrictions[option],
      },
    }));
  };

  const handleGoalChange = (goal) => {
    setTemporaryPreferences((prev) => ({
      ...prev,
      goal,
    }));
  };

  const handleCalorieRangeChange = (e) => {
    setTemporaryPreferences((prev) => ({
      ...prev,
      calorieRange: parseInt(e.target.value) || 0,
    }));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center p-4 bg-gray-800 text-white space-x-20">
      {/* Company title */}
      <div className="text-xl font-bold mr-10 ">NutriHall</div>

      {/* Temporary Preferences */}
      <div className="flex items-center space-x-4 overflow-auto">
        {/* Dietary Restrictions */}
        <div className="flex items-center">
          <label className="mr-6">Restrictions:</label>
          <div className="flex space-x-4">
            {dietaryOptions.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={temporaryPreferences.dietaryRestrictions[option] || false}
                  onChange={() => handleToggle(option)}
                  className="mr-1"
                />
                <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* User profile */}
      <UserProfile />
    </header>
  );
};

export default Header;
