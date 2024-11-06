// src/components/History.jsx
import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, get, child } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [user] = useAuthState(auth);
  const [meals, setMeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const mealsRef = ref(database, `meals/${user.uid}`);
        const snapshot = await get(mealsRef);
        
        if (snapshot.exists()) {
          const mealsData = Object.entries(snapshot.val()).map(([id, data]) => ({
            id,
            ...data
          }));
          setMeals(mealsData);
        } else {
          console.log('No meals found for this user.');
        }
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };

    if (user) {
      fetchMeals();
    }
  }, [user]);

  const handleMealClick = (mealId) => {
    navigate(`/record-meal/${mealId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Meal History</h1>
      <ul>
        {meals.map((meal) => (
          <li
            key={meal.id}
            className="border-b py-2 cursor-pointer"
            onClick={() => handleMealClick(meal.id)}
          >
            {meal.date} - {meal.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
