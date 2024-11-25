import React, {useEffect, useState} from 'react';
import {ref, onValue, remove} from 'firebase/database';
import {auth, database} from '../firebaseConfig';
import '../styles/FoodDiary.css';
import crossImg from '../assets/cross.gif';

function formatDate(date) {
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

    const [mealDiary, setMealDiary] = useState([]);
    const [calorieData, setCalorieData] = useState([]);
    const [calorieGoal, setCalorieGoal] = useState(2000);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) return;

        const diaryRef = ref(database, `users/${user.uid}/diary`);
        onValue(diaryRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const diaryList = Object.entries(data).map(([id, entry]) => ({
                    id,
                    ...entry,
                }));

                // Sort entries in reverse chronological order
                diaryList.sort((a, b) => new Date(b.recordedAt) - new Date(a.recordedAt));
                console.log('diaryList:', diaryList);
                setMealDiary(diaryList);

                // Process data for the chart
                const calorieDataMap = {};

                diaryList.forEach((entry) => {
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
                setMealDiary([]);
                setCalorieData([]);
            }
        });
    }, [user]);

    const handlePreviousDay = () => {
        setSelectedDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() - 1);
            return newDate;
        });
    };

    const handleNextDay = () => {
        setSelectedDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() + 1);
            return newDate;
        });
    };

    const filteredDiary = mealDiary.filter(
        (entry) => entry.recordedAt.split('T')[0]  === selectedDate.toISOString().split('T')[0]
    )

    const deleteRow = (id) => {
        const diaryRef = ref(database, `users/${user.uid}/diary`);
        onValue(diaryRef, (snapshot) => {
            const data = snapshot.val();
            if (data){
                //const entryKey = Object.keys(data).find((key) => data[key].id === id);
                //if (entryKey){
                  //  const entryRef = ref(database, `users/${user.uid}/diary/${entryKey}`);
                    const entryRef = ref(database, `users/${user.uid}/diary/${id}`);  
                    remove(entryRef);
                    setMealDiary((prevDiary) => prevDiary.filter((entry) => entry.id !== id));
               // }
            }
        })
    };

return (
    <div className="food-diary">
            <h2>Your Food Diary For:</h2>
            <div className="date-nav">
                <button onClick={handlePreviousDay}>&lt;</button>
                <span>{formatDate(selectedDate)}</span>
                <button onClick={handleNextDay}>&gt;</button>
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
                        {filteredDiary.map((entry) => (
                            <tr key={entry.id}>
                                <td data-label="Item">{entry.name}</td>
                                <td data-label="Calories">{entry.nutrition.calories || 'N/A'}</td>
                                <td data-label="Carbs">{entry.nutrition.totalCarb || 'N/A'}</td>
                                <td data-label="Fat">{entry.nutrition.totalFat || 'N/A'}</td>
                                <td data-label="Protein">{entry.nutrition.protein || 'N/A'}</td>
                                <td data-label="Remove">
                                    <button onClick={() => deleteRow(entry.id)}>
                                        <img src={crossImg} alt="Delete" />
                                    </button>
                                </td>
                                
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredDiary.length === 0 && (
                    <p>Navigate to the menu to record meals!</p>
                )}
            </section>
    </div>
);
};

export default FoodDiary;