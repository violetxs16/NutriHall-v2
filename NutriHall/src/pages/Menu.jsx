// src/Pages/Menu.jsx
import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Navbar from '../components/Navbar';
import MenuItems from '../components/MenuItems';
import useMenuData from '../components/MenuData';
import '../styles/main.css'

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [all, setAll] = useState(true);
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [shakes, setShakes] = useState(false);

  const user = auth.currentUser;

  // Destructure menuData and error from useMenuData hook
  const { menuData, error } = useMenuData();

  useEffect(() => {
    // Fetch full menu items from your data source
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch user preferences
      const prefsRef = ref(database, `users/${user.uid}/preferences`);
      onValue(prefsRef, (snapshot) => {
        const prefsData = snapshot.val();
        if (prefsData) {
          setPreferences(prefsData);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (menuItems.length > 0 && preferences) {
      // Filter menu items based on preferences
      const filtered = menuItems.filter((item) => {
        // Assume each item has a 'tags' array that includes dietary info
        for (let restriction in preferences.dietaryRestrictions) {
          if (
            preferences.dietaryRestrictions[restriction] &&
            item.tags.includes(restriction)
          ) {
            return false; // Exclude this item
          }
        }
        return true; // Include this item
      });
      setFilteredItems(filtered);
    }
  }, [menuItems, preferences]);

  const fetchMenuItems = () => {
      // Use menuData from useMenuData hook or fetch from other sources if necessary
    setMenuItems(menuData);
  };

  return (
    <div className="p-6">
      {/* Navbar Component */}
      <Navbar
        setAll={setAll}
        setBreakfast={setBreakfast}
        setLunch={setLunch}
        setShakes={setShakes}
      />
      {/* MenuItems Component */}
      <MenuItems
        items={menuData}
        all={all}
        breakfast={breakfast}
        lunch={lunch}
        shakes={shakes}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="border p-4 rounded">
            <h2 className="text-xl mb-2">{item.name}</h2>
            <p>{item.description}</p>
            {/* Display other item details */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
