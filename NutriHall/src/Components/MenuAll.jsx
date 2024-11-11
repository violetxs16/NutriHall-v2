import { motion } from 'framer-motion';
import React, { useContext, useEffect, useState } from 'react';
import { PreferencesContext } from '../contexts/PreferencesContext';
import { auth, database } from '../firebaseConfig';
import { ref, push } from 'firebase/database';
// Import all restriction images
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

const MenuAll = ({ all, items }) => {
  const { temporaryPreferences } = useContext(PreferencesContext);
  const [filteredItems, setFilteredItems] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const { dietaryRestrictions } = temporaryPreferences;

    const activeRestrictions = Object.keys(dietaryRestrictions).filter(
      (key) => dietaryRestrictions[key]
    );

    

    const filtered = items.filter((item) => {
      // Exclude items that match any active dietary restrictions
      for (let restriction of activeRestrictions) {
        if (item.restrictions.includes(restriction)) {
          return false; // Exclude this item
        }
      }
      return true; // Include this item
    });
    
    setFilteredItems(filtered);
  }, [items, temporaryPreferences]);

  const handleRecordMeal = (item) => {
    if (!user) {
      alert('Please log in to record meals.');
      return;
    }

    const historyRef = ref(database, `users/${user.uid}/history`);
    const newEntry = {
      ...item,
      recordedAt: new Date().toISOString(),
    };

    push(historyRef, newEntry)
      .then(() => {
        alert('Meal recorded successfully!');
      })
      .catch((error) => {
        console.error('Error recording meal:', error);
      });
  };


  return (
    <>
      {all &&
        filteredItems.map((item) => (
          <div className="menu-items" key={item.id}>
            <div className="item-content">
              <div className="item-title-box">
                <h5 className="item-title">{item.title}</h5>
                <div className="item-image-restrictions">
                  {item.restrictions.map((restriction) =>
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
                {item.restrictions.length > 0 ? (
                  <p>Restrictions: {item.restrictions.join(', ')}</p>
                ) : (
                  <p>No restrictions</p>
                )}
              </div>
              {/* Record Meal Button */}
              <button
                onClick={() => handleRecordMeal(item)}
                className="mt-2 px-2 py-2 bg-green-200 text-#1F2937 rounded w-40"
              >
                Record Meal
              </button>
            </div>
          </div>
        ))}
    </>
  );
};

export default MenuAll;
