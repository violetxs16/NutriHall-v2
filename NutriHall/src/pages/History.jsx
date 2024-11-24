// src/Pages/History.jsx
import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { calculateCalorieRange } from '../utils/calorieCalculator';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const History = () => {
  const [mealHistory, setMealHistory] = useState([]);
  const [calorieData, setCalorieData] = useState([]);
  const [calorieGoal, setCalorieGoal] = useState(2000); // Default value
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    // Fetch user's accountInfo to get weight, height, sex, age, goal
    const accountRef = ref(database, `users/${user.uid}/accountInfo`);
    const prefsRef = ref(database, `users/${user.uid}/preferences`);
    let accountInfo = {};
    let preferences = {};

    // Fetch account info
    onValue(accountRef, (snapshot) => {
      if (snapshot.exists()) {
        accountInfo = snapshot.val();

        // Fetch preferences after accountInfo is available
        onValue(prefsRef, (prefsSnapshot) => {
          if (prefsSnapshot.exists()) {
            preferences = prefsSnapshot.val();

            // Calculate calorie goal
            const calculatedCalorieGoal = calculateCalorieRange(
              accountInfo.weight,
              accountInfo.height,
              accountInfo.sex,
              preferences.goal,
              accountInfo.age
            );
            setCalorieGoal(calculatedCalorieGoal);
          }
        });
      }
    });

    // Fetch meal history
    const historyRef = ref(database, `users/${user.uid}/history`);
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const historyList = Object.entries(data).map(([id, entry]) => ({
          id,
          ...entry,
        }));

        // Sort entries in reverse chronological order
        historyList.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));

        setMealHistory(historyList);

        // Process data for the chart
        const calorieDataMap = {};

        historyList.forEach((entry) => {
          const date = entry.recordedAt.split('T')[0]; // Get date in YYYY-MM-DD format
          const calories = parseInt(entry.calories) || 0;

          if (calorieDataMap[date]) {
            calorieDataMap[date] += calories;
          } else {
            calorieDataMap[date] = calories;
          }
        });

        // Convert calorieDataMap to array and sort by date
        const calorieDataArray = Object.keys(calorieDataMap)
          .map((date) => ({
            date,
            calories: calorieDataMap[date],
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setCalorieData(calorieDataArray);
      } else {
        setMealHistory([]);
        setCalorieData([]);
      }
    });
  }, [user]);

  // Function to clear history
  const clearHistory = () => {
    if (!user) return;
    if (window.confirm('Are you sure you want to clear your history?')) {
      const historyRef = ref(database, `users/${user.uid}/history`);
      remove(historyRef)
        .then(() => {
          alert('History cleared successfully!');
        })
        .catch((error) => {
          console.error('Error clearing history:', error);
        });
    }
  };

  // Calculate total calories and protein consumed today
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = mealHistory.filter((entry) => entry.recordedAt.startsWith(today));
  const totalCaloriesConsumed = todayMeals.reduce((sum, entry) => sum + (parseInt(entry.calories) || 0), 0);
  const totalProteinConsumed = todayMeals.reduce((sum, entry) => sum + (parseInt(entry.protein) || 0), 0);

  // User's protein goal (you may need to fetch this from preferences or accountInfo)
  const proteinGoal = 150; // Example value

  // Calculate percentages
  const caloriePercentage = Math.min((totalCaloriesConsumed / calorieGoal) * 100, 100);
  const proteinPercentage = Math.min((totalProteinConsumed / proteinGoal) * 100, 100);

  return (
    <div className="p-6">
      {/* Top Section with Macros Left */}
      <div className="mb-6 flex space-x-8">
        {/* Calories Progress Bar */}
        <div style={{ width: 150, height: 150 }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `conic-gradient(#8884d8 ${caloriePercentage * 3.6}deg, #ccc 0deg)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div>{`${Math.round(caloriePercentage)}%`}</div>
              <div className="text-sm">Calories</div>
            </div>
          </div>
        </div>

        {/* Protein Progress Bar */}
        <div style={{ width: 150, height: 150 }}>
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `conic-gradient(#82ca9d ${proteinPercentage * 3.6}deg, #ccc 0deg)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div>{`${Math.round(proteinPercentage)}%`}</div>
              <div className="text-sm">Protein</div>
            </div>
          </div>
        </div>
      </div>

      {/* Calorie Chart */}
      <div className="mb-6">
        <h2 className="text-xl mb-4">Calorie Intake Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={calorieData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, Math.max(calorieGoal, ...calorieData.map((d) => d.calories))]} />
            <Tooltip />
            <Line type="monotone" dataKey="calories" stroke="#8884d8" name="Calories Eaten" />
            <Line
              type="monotone"
              dataKey={() => calorieGoal}
              stroke="#82ca9d"
              name="Calorie Goal"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Meal History List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Meal History</h2>
          <button onClick={clearHistory} className="px-4 py-2 bg-red-500 text-white rounded">
            Clear History
          </button>
        </div>
        {mealHistory.length === 0 ? (
          <p>No meals recorded yet.</p>
        ) : (
          mealHistory.map((entry) => (
            <div key={entry.id} className="border p-4 mb-4 rounded">
              <h3 className="text-lg">{entry.title}</h3>
              <p>{entry.desc}</p>
              <p>Calories: {entry.nutrition.calories || 'N/A'}</p>
              <p>Protein: {entry.nutrition.protein || 'N/A'}</p>
              <p>
                Recorded At: {new Date(entry.recordedAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
