// src/Pages/History.jsx
import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebaseConfig';
import { ref, onValue, remove, set } from 'firebase/database';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import ReactStars from 'react-rating-stars-component';
import 'react-circular-progressbar/dist/styles.css';

const History = () => {
  const [mealHistory, setMealHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [nutrientGoals, setNutrientGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 300,
    fats: 70,
    fibers: 30,
  });
  const [timeRange, setTimeRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [sortType, setSortType] = useState('date_desc'); // Default sort by newest date
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

            // Set nutrient goals from user preferences
            const calculatedCalorieGoal = preferences.calorieRange || 2000;
            const calculatedProteinGoal = preferences.proteinGoal || 150;

            setNutrientGoals((prevGoals) => ({
              ...prevGoals,
              calories: calculatedCalorieGoal,
              protein: calculatedProteinGoal,
              // You can set carbs, fats, and fibers if stored in preferences
            }));
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

        setMealHistory(historyList);

        // Process data for the charts
        processChartData(historyList);
      } else {
        setMealHistory([]);
        setChartData([]);
      }
    });
  }, [user, timeRange]);

  const processChartData = (historyList) => {
    // Determine start date based on timeRange
    let startDate = null;
    if (timeRange === '7d') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeRange === '30d') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
    }

    const nutrientDataMap = {};

    historyList.forEach((entry) => {
      const date = entry.recordedAt.split('T')[0]; // Get date in YYYY-MM-DD format
      const entryDate = new Date(date);

      if (startDate && entryDate < startDate) {
        return; // Skip entries outside the time range
      }

      const nutrients = {
        calories: parseInt(entry.nutrition?.calories) || 0,
        protein: parseInt(entry.nutrition?.protein) || 0,
        carbs: parseInt(entry.nutrition?.carbohydrates) || 0,
        fats: parseInt(entry.nutrition?.fats) || 0,
        fibers: parseInt(entry.nutrition?.fiber) || 0,
      };

      if (!nutrientDataMap[date]) {
        nutrientDataMap[date] = { date, ...nutrients };
      } else {
        // Accumulate nutrients for the date
        nutrientDataMap[date].calories += nutrients.calories;
        nutrientDataMap[date].protein += nutrients.protein;
        nutrientDataMap[date].carbs += nutrients.TotalCarb;
        nutrientDataMap[date].fats += nutrients.TotalFat;
        nutrientDataMap[date].fibers += nutrients.dietaryFiber;
      }
    });

    const nutrientDataArray = Object.values(nutrientDataMap).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    setChartData(nutrientDataArray);
  };

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

  // Calculate total nutrients consumed today
  const today = new Date().toISOString().split('T')[0];
  const todayMeals = mealHistory.filter((entry) => entry.recordedAt.startsWith(today));

  const nutrientsConsumed = {
    calories: todayMeals.reduce(
      (sum, entry) => sum + (parseInt(entry.nutrition?.calories) || 0),
      0
    ),
    protein: todayMeals.reduce(
      (sum, entry) => sum + (parseInt(entry.nutrition?.protein) || 0),
      0
    ),
    carbs: todayMeals.reduce(
      (sum, entry) => sum + (parseInt(entry.nutrition?.TotalCarb) || 0),
      0
    ),
    fats: todayMeals.reduce(
      (sum, entry) => sum + (parseInt(entry.nutrition?.TotalFat) || 0),
      0
    ),
    fibers: todayMeals.reduce(
      (sum, entry) => sum + (parseInt(entry.nutrition?.dietaryFiber) || 0),
      0
    ),
  };

  const nutrientPercentages = {};
  Object.keys(nutrientsConsumed).forEach((nutrient) => {
    nutrientPercentages[nutrient] = Math.min(
      (nutrientsConsumed[nutrient] / nutrientGoals[nutrient]) * 100,
      100
    );
  });

  // Handle rating change
  const handleRatingChange = (entryId, newRating) => {
    if (!user) return;

    const entryRef = ref(database, `users/${user.uid}/history/${entryId}/rating`);

    set(entryRef, newRating)
      .then(() => {
        console.log('Rating updated successfully');
      })
      .catch((error) => {
        console.error('Error updating rating:', error);
      });
  };

  // Handle search
  const filteredMealHistory = mealHistory.filter((entry) => {
    if (searchQuery.trim() === '') return true;

    if (searchType === 'name') {
      return entry.name?.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchType === 'date') {
      return entry.recordedAt.startsWith(searchQuery);
    } else if (searchType === 'rating') {
      return (
        (entry.rating || 0) >= parseFloat(searchQuery) || searchQuery.trim() === ''
      );
    }
    return true;
  });

  // Handle sorting
  const sortedMealHistory = [...filteredMealHistory].sort((a, b) => {
    switch (sortType) {
      case 'date_asc':
        return new Date(a.recordedAt) - new Date(b.recordedAt);
      case 'date_desc':
        return new Date(b.recordedAt) - new Date(a.recordedAt);
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'calories_asc':
        return (
          (parseInt(a.nutrition?.calories) || 0) - (parseInt(b.nutrition?.calories) || 0)
        );
      case 'calories_desc':
        return (
          (parseInt(b.nutrition?.calories) || 0) - (parseInt(a.nutrition?.calories) || 0)
        );
      case 'rating_asc':
        return (a.rating || 0) - (b.rating || 0);
      case 'rating_desc':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  // Colors for nutrients
  const nutrientColors = {
    calories: '#8884d8',
    protein: '#82ca9d',
    carbs: '#ff7300',
    fats: '#a83279',
    fibers: '#2a71d0',
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Search Bar and Dropdowns */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full mr-2 bg-white text-black"
        />

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="border p-2 rounded bg-white text-black"
        >
          <option value="date_desc">Date (Newest First)</option>
          <option value="date_asc">Date (Oldest First)</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
          <option value="calories_desc">Calories (High to Low)</option>
          <option value="calories_asc">Calories (Low to High)</option>
          <option value="rating_desc">Rating (High to Low)</option>
          <option value="rating_asc">Rating (Low to High)</option>
        </select>
      </div>

      {/* Nutrient Pie Charts */}
      <div className="mb-6 flex flex-wrap justify-center space-x-4">
        {Object.keys(nutrientsConsumed).map((nutrient) => (
          <div key={nutrient} style={{ width: 100, height: 100 }}>
            <PieChart width={100} height={100}>
              <Pie
                data={[
                  { name: 'Consumed', value: nutrientsConsumed[nutrient] },
                  {
                    name: 'Remaining',
                    value: nutrientGoals[nutrient] - nutrientsConsumed[nutrient],
                  },
                ]}
                dataKey="value"
                innerRadius={30}
                outerRadius={40}
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill={nutrientColors[nutrient]} />
                <Cell fill="#e0e0e0" />
              </Pie>
            </PieChart>
            <div style={{ textAlign: 'center', fontSize: '12px' }}>
              {nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
            </div>
          </div>
        ))}
      </div>

      {/* Time Range Selection */}
      <div className="mb-4">
        <label className="mr-2">Time Range:</label>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border p-2 rounded bg-white text-black"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Combined Nutrient Chart with Dual Y-Axes */}
      <div className="mb-6">
        <h2 className="text-xl mb-4">Nutrient Intake Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            {/* Left Y-Axis for Calories */}
            <YAxis
              yAxisId="left"
              label={{ value: 'Calories', angle: -90, position: 'insideLeft' }}
            />
            {/* Right Y-Axis for Grams */}
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'Grams', angle: 90, position: 'insideRight' }}
            />
            <Tooltip />
            {/* Calories Line */}
            <Line
              type="monotone"
              dataKey="calories"
              stroke={nutrientColors.calories}
              name="Calories"
              yAxisId="left"
            />
            {/* Other Nutrients Lines */}
            <Line
              type="monotone"
              dataKey="protein"
              stroke={nutrientColors.protein}
              name="Protein"
              yAxisId="right"
            />
            <Line
              type="monotone"
              dataKey="carbs"
              stroke={nutrientColors.TotalCarb}
              name="Carbs"
              yAxisId="right"
            />
            <Line
              type="monotone"
              dataKey="fats"
              stroke={nutrientColors.TotalFat}
              name="Fats"
              yAxisId="right"
            />
            <Line
              type="monotone"
              dataKey="fibers"
              stroke={nutrientColors.dietaryFiber}
              name="Fibers"
              yAxisId="right"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Meal History List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Meal History</h2>
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Clear History
          </button>
        </div>
        {sortedMealHistory.length === 0 ? (
          <p>No meals recorded yet.</p>
        ) : (
          sortedMealHistory.map((entry) => (
            <div key={entry.id} className="border p-4 mb-4 rounded">
              <h3 className="text-lg">{entry.name}</h3>
              <p>{entry.desc}</p>
              <p>Calories: {entry.nutrition?.calories || 'N/A'}</p>
              <p>Protein: {entry.nutrition?.protein || 'N/A'} g</p>
              <p>Carbs: {entry.nutrition?.TotalCarb || 'N/A'} g</p>
              <p>Fats: {entry.nutrition?.TotalFat || 'N/A'} g</p>
              <p>Fibers: {entry.nutrition?.dietaryFiber || 'N/A'} g</p>
              <p>
                Recorded At: {new Date(entry.recordedAt).toLocaleString()}
              </p>
              {/* Rating Component */}
              <div className="mt-2">
                <ReactStars
                  count={5}
                  onChange={(newRating) => handleRatingChange(entry.id, newRating)}
                  size={24}
                  isHalf={true}
                  value={entry.rating || 0}
                  emptyIcon={<i className="far fa-star"></i>}
                  halfIcon={<i className="fa fa-star-half-alt"></i>}
                  fullIcon={<i className="fa fa-star"></i>}
                  activeColor="#ffd700"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
