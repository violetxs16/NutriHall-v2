// src/components/Header.jsx
import React, { useContext, useState, useEffect } from 'react';
import UserProfile from './UserProfile';
import { PreferencesContext } from '../contexts/PreferencesContext';
import { CSSTransition } from 'react-transition-group';
import '../styles/Header.css'; // Import CSS for transitions

const Header = () => {
  const { temporaryPreferences, setTemporaryPreferences } = useContext(PreferencesContext);
  const [showRestrictions, setShowRestrictions] = useState(true);

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


  const toggleRestrictions = () => {
    setShowRestrictions((prev) => !prev);
  };

  // Auto-close restrictions when viewport is too narrow
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1600 && showRestrictions) {
        setShowRestrictions(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [showRestrictions]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center p-4 bg-gray-800 text-white space-x-6">
      {/* Company title */}
      <div className="text-xl font-bold mr-10">NutriHall</div>

      {/* Preferences */}
      <div className="flex items-center space-x-10">
        {/* Dietary Restrictions */}
        <div className="flex items-center">
          <button onClick={toggleRestrictions} className="mr-4">
            Restrictions
          </button>
          <CSSTransition
            in={showRestrictions}
            timeout={300}
            classNames="restrictions"
            unmountOnExit
          >
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
          </CSSTransition>
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
