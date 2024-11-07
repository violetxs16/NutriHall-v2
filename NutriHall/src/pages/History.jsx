// src/Pages/History.jsx
import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const History = () => {
  const [mealHistory, setMealHistory] = useState([]);
  const [calorieData, setCalorieData] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

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
        const calorieData = historyList.map((entry) => ({
          date: entry.recordedAt.split('T')[0],
          calories: entry.calories || 0, // Ensure calories are provided
        }));

        // Aggregate calories per day
        const aggregatedData = calorieData.reduce((acc, curr) => {
          const existing = acc.find((item) => item.date === curr.date);
          if (existing) {
            existing.calories += curr.calories;
          } else {
            acc.push({ ...curr });
          }
          return acc;
        }, []);

        setCalorieData(aggregatedData);
      } else {
        setMealHistory([]);
        setCalorieData([]);
      }
    });
  }, [user]);

  // User's calorie goal from preferences (you may need to fetch this)
  const calorieGoal = 2000;

  return (
    <div className="p-6">
      {/* Top Section with Macros Left */}
      <div className="mb-6">
        {/* Implement the double pie chart here */}
        {/* Placeholder for now */}
        <h2 className="text-2xl">Calories and Protein Macros Left</h2>
        {/* You can use a library like react-circular-progressbar */}
      </div>

      {/* Calorie Chart */}
      <div className="mb-6">
        <h2 className="text-xl mb-4">Calorie Intake Over Time</h2>
        <LineChart width={600} height={300} data={calorieData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, Math.max(...calorieData.map((d) => d.calories, calorieGoal))]} />
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
      </div>

      {/* Meal History List */}
      <div>
        <h2 className="text-xl mb-4">Meal History</h2>
        {mealHistory.map((entry) => (
          <div key={entry.id} className="border p-4 mb-4 rounded">
            <h3 className="text-lg">{entry.title}</h3>
            <p>{entry.desc}</p>
            <p>Calories: {entry.calories || 'N/A'}</p>
            <p>
              Recorded At:{' '}
              {new Date(entry.recordedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
