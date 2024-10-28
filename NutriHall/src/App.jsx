
import './App.css'
/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx, Global } from "@emotion/react";
import { useState } from "react";

import { database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';

import MenuItems from "./Components/MenuItems";
import MenuData from "./Components/MenuData";
import Navbar from "./Components/Navbar";
function App() {
  const [all, setAll] = useState(true);
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [shakes, setShakes] = useState(false);

  // State to hold meals data from Firebase
  const [meals, setMeals] = useState([]);
  const [error, setError] = useState('');
  /**The useEffect fetches meal data from Firebase and updates the meals state. */
  useEffect(() => {
    // Reference to the 'Meals' path in Firebase Realtime Database
    const mealsRef = ref(database, 'Meals');
    
    // Listen for changes at the 'Meals' path
    onValue(mealsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const mealList = Object.values(data);  // Convert data to an array
        console.log("Fetched meals data:", mealList);
        setMeals(mealList);
      } else {
        console.log("No data available");
      }
    }, (error) => {
      setError("Error fetching data");
      console.error(error);
    });
  }, []);
  return (
    <div
      className="App"
      css={css`
        background: #f0eff1;
        height: 100%;
        padding: 70px 0;
      `}
    >
      <Navbar
        setAll={setAll}
        setBreakfast={setBreakfast}
        setLunch={setLunch}
        setShakes={setShakes}
      />

      <MenuItems
        items={MenuData}
        all={all}
        breakfast={breakfast}
        lunch={lunch}
        shakes={shakes}
      />

      <Global
        styles={css`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");

          ::selection {
            background: #000;
            color: #f0eff1;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Poppins", sans-serif;
            --webkit-tap-highlight-color: transparent;
          }

          body::-webkit-scrollbar {
            width: 12px; /* width of the entire scrollbar */
          }

          body::-webkit-scrollbar-track {
            background: #f0eff1; /* color of the tracking area */
          }

          body::-webkit-scrollbar-thumb {
            background-color: #444444; /* color of the scroll thumb */
            border-radius: 20px; /* roundness of the scroll thumb */
            border: 3px solid #f0eff1; /* creates padding around scroll thumb */
          }

          body {
            background: #f0eff1;
          }

          .container {
            width: 80%;
            margin: auto;
          }
        `}
      />
    </div>
  );
}

export default App;
