// src/components/RestrictionHeader.jsx
import React, { useContext } from 'react';
import { PreferencesContext } from '../contexts/PreferencesContext';

const RestrictionHeader = () => {
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

  return (
    <div className="flex items-center z-10">
      {/* Visible on medium and larger screens */}
      <div className="hidden md:flex flex-wrap space-x-4">
        {dietaryOptions.map((option) => (
          <label key={option} className="flex items-center">
            <input
              type="checkbox"
              checked={temporaryPreferences.dietaryRestrictions[option] || false}
              onChange={() => handleToggle(option)}
              className="checkbox checkbox-primary mr-1"
            />
            <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
          </label>
        ))}
      </div>
      {/* Dropdown for small screens */}
      <div className="md:hidden dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-primary m-1 transition duration-200 ease-in-out transform hover:scale-105">
          Restrictions
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          {dietaryOptions.map((option) => (
            <li key={option}>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={temporaryPreferences.dietaryRestrictions[option] || false}
                  onChange={() => handleToggle(option)}
                  className="checkbox checkbox-primary mr-2"
                />
                <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RestrictionHeader;
