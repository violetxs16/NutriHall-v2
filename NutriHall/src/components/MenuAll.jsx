//src/MenuAll.jsx
import { motion } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import { PreferencesContext } from '../contexts/PreferencesContext';
import { auth, database } from '../firebaseConfig';
import { ref, push } from 'firebase/database';
import veganImg from '../assets/vegan.gif';
import alcoholImg from '../assets/alcohol.gif';
import beefImg from '../assets/beef.gif';
import fishImg from '../assets/fish.gif';
import glutenImg from '../assets/gluten.gif';
import halalImg from '../assets/halal.gif';
import nutsImg from '../assets/nuts.gif';
import porkImg from '../assets/pork.gif';
import shellfishImg from '../assets/shellfish.gif';
import treenutImg from '../assets/treenut.gif';
import soyImg from '../assets/soy.gif';
import sesameImg from '../assets/sesame.gif';
import milkImg from '../assets/milk.gif';
import eggsImg from '../assets/eggs.gif';
import veggieImg from '../assets/veggie.gif';

// Define the restrictionImages object
const restrictionImages = {
  vegan: veganImg,
  alcohol: alcoholImg,
  beef: beefImg,
  fish: fishImg,
  gluten: glutenImg,
  halal: halalImg,
  nuts: nutsImg,
  pork: porkImg,
  shellfish: shellfishImg,
  treenut: treenutImg,
  soy: soyImg,
  sesame: sesameImg,
  milk: milkImg,
  eggs: eggsImg,
  veggie: veggieImg,
};

// Utility function to convert fields to arrays
function toArray(field) {
  if (Array.isArray(field)) {
    return field;
  } else if (field && typeof field === 'object') {
    return Object.keys(field); // Now returns ['Rachel Carson & Oakes', ...]
  } else {
    return [];
  }
}


const MenuAll = ({
  items = [],
  searchQuery = '',
  selectedDiningHall = '',
  all = true,
  breakfast = false,
  lunch = false,
  dinner = false,
}) => {
  const [filteredItems, setFilteredItems] = useState([]);
  const user = auth.currentUser;
  const { temporaryPreferences } = useContext(PreferencesContext);

  useEffect(() => {
    console.log('Items in MenuAll:', items);
    let filtered = [...items];
    console.log('Initial items count:', filtered.length);
  
    // Apply dietary restrictions from preferences
    if (temporaryPreferences && temporaryPreferences.dietaryRestrictions) {
      const activeRestrictions = Object.keys(temporaryPreferences.dietaryRestrictions).filter(
        (key) => temporaryPreferences.dietaryRestrictions[key]
      );
      console.log('Active Restrictions:', activeRestrictions);
  
      if (activeRestrictions.length > 0) {
        filtered = filtered.filter((item) => {
          const itemRestrictions = toArray(item.restrictions);
          if (itemRestrictions.length > 0) {
            for (let restriction of itemRestrictions) {
              if (activeRestrictions.includes(restriction)) {
                return false; // Exclude this item
              }
            }
          }
          return true; // Include this item
        });
      }
    }
  
    console.log('After dietary restrictions filtering:', filtered.length);

    // Apply search query filtering
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply dining hall selection filtering
    if (selectedDiningHall) {
      filtered = filtered.filter((item) => {
        const itemDiningHalls = toArray(item.diningHalls);
        console.log('Item:', item.name);
        console.log('Item diningHalls:', itemDiningHalls);
        console.log('Selected Dining Hall:', selectedDiningHall);
        return itemDiningHalls.includes(selectedDiningHall);
      });
    }

    // Filter based on meal times
    if (!all) {
      const selectedMeals = [];
      if (breakfast) selectedMeals.push('breakfast');
      if (lunch) selectedMeals.push('lunch');
      if (dinner) selectedMeals.push('dinner');

      if (selectedMeals.length > 0) {
        filtered = filtered.filter((item) => {
          const itemMealPeriods = toArray(item.mealPeriods);
          return itemMealPeriods.some((meal) =>
            selectedMeals.includes(meal.toLowerCase())
          );
        });
      } else {
        // If no meal time is selected, show no items
        filtered = [];
      }
    }

    setFilteredItems(filtered);
  }, [
    items,
    temporaryPreferences,
    searchQuery,
    selectedDiningHall,
    all,
    breakfast,
    lunch,
    dinner,
  ]);

  // Debugging
  console.log('Filtered Items in MenuAll:', filteredItems);

  const handleRecordMeal = (item) => {
    if (!user) {
      alert('Please log in to record meals.');
      return;
    }

    const diaryRef = ref(database, `users/${user.uid}/diary`);
    const newEntry = {
      ...item,
      recordedAt: new Date().toISOString(),
    };

    push(diaryRef, newEntry)
      .then(() => {
        alert('Meal recorded successfully!');
      })
      .catch((error) => {
        console.error('Error recording meal:', error);
      });
  };

  return (
    <>
      {filteredItems.length > 0 ? (
        filteredItems.map((item) => (
          <div className="menu-items" key={`${item.name}-${item.diningHalls[0]}`}>
            <div className="item-content">
              <div className="item-title-box">
                <h5 className="item-title">{item.name}</h5>
                <div className="item-image-restrictions">
                  {item.restrictions &&
                    toArray(item.restrictions).map((restriction) =>
                      restrictionImages[restriction] ? (
                        <img
                          key={restriction}
                          src={restrictionImages[restriction]}
                          alt={restriction}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            marginRight: '5px',
                            objectFit: 'cover',
                          }}
                        />
                      ) : null
                    )}
                </div>
              </div>
              <div className="item-restrictions">
                {item.restrictions && toArray(item.restrictions).length > 0 ? (
                  <p>Restrictions: {toArray(item.restrictions).join(', ')}</p>
                ) : (
                  <p>No restrictions</p>
                )}
              </div>
              {/* Record Meal Button */}
              <button
                onClick={() => handleRecordMeal(item)}
                className="mt-2 px-2 py-2 bg-green-600 text-#64748b rounded w-40"
              >
                Record Meal
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No items match your criteria.</p>
      )}
    </>
  );
};

export default MenuAll;
