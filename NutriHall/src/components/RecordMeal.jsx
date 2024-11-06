// src/components/RecordMeal.jsx
import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, get } from 'firebase/database';

const RecordMeal = () => {
  const [user] = useAuthState(auth);
  const [meal, setMeal] = useState(null);
  const [preferences, setPreferences] = useState(null);

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

    if (user) {
      fetchPreferences(user.uid);
    }
  }, [user]);

  const generateMeal = () => {
    const user = auth.currentUser;
    if (user) {
      // Fetch preferences
      const prefsRef = ref(database, `users/${user.uid}/preferences`);
      onValue(prefsRef, (snapshot) => {
        const prefs = snapshot.val();
        // Use prefs.dietaryRestrictions and prefs.calorieRange
        // Generate meal accordingly
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Record Meal</h1>
      {/* Display meal and provide options to accept or regenerate */}
      <button
        onClick={generateMeal}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate Meal
      </button>
      {/* Meal details */}
    </div>
  );
};

export default RecordMeal;
