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
    <div className="dropdown dropdown-end z-30">
      <label
        tabIndex={0}
        className="btn btn-primary m-1 transition duration-200 ease-in-out transform hover:scale-105"
      >
        Dietary Restrictions
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-secondary text-secondary-content rounded-box w-52"
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
  );
};

export default RestrictionHeader;
