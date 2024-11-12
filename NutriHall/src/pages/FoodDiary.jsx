import React, {useEffect, useState} from 'react';
import {ref, onValue, remove} from 'firebase/database';
import {auth, database} from '../firebaseConfig';
import '../styles/FoodDiary.css';

function TodaysDate() {
    const date = new Date();
    let weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    let current_day = weekday[date.getDay()];
    let months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    let current_month = months[date.getMonth()];
    let current_year = date.getFullYear();
    let current_date = date.getDate();
    let today = current_day + ", " + current_month + " " + current_date + ", " + current_year;
    return today;
}

function FoodDiary() {

    const [mealHistory, setMealHistory] = useState([]);
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

    const deleteRow = (id) => {
        const entryRef = ref(database, `users/${user.uid}/history/${id}`);
        setMealHistory((prevHistory) => prevHistory.filter((entry) => entry.id !== id));
        remove(entryRef);
    }

return (
    <div className="food-diary">
            <h2>Your Food Diary For:</h2>
            <div className="date-nav">
                <button>&lt;</button>
                <span><TodaysDate/></span>
                <button>&gt;</button>
            </div>
            <section>
                <table className="food-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Calories</th>
                            <th>Carbs</th>
                            <th>Fat</th>
                            <th>Protein</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mealHistory.map((entry) => (
                            <tr key={entry.id}>
                                <td data-label="Item">{entry.title}</td>
                                <td data-label="Calories">{entry.calories || 'N/A'}</td>
                                <td data-label="Carbs">{entry.carbs || 'N/A'}</td>
                                <td data-label="Fat">{entry.fat || 'N/A'}</td>
                                <td data-label="Protein">{entry.protein || 'N/A'}</td>
                                <td data-label="Remove">
                                    <button onClick={() => deleteRow(entry.id)}>
                                        <img src='../src/assets/cross.gif' alt="Delete" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
    </div>
);
};

export default FoodDiary;