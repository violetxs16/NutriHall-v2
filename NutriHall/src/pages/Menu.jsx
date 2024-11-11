// src/Pages/Menu.jsx
import React, { useState, useEffect } from 'react';
import { auth, database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Navbar from '../components/Navbar';
import MenuItems from '../components/MenuItems';
import useMenuData from '../components/MenuData';
import MenuAll from '../components/MenuAll';
import backgroundImage from '../assets/ucsc_map.jpg';
import '../styles/main.css'

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [all, setAll] = useState(true);
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [shakes, setShakes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiningHall, setSelectedDiningHall] = useState(null);


  const user = auth.currentUser;

  // Destructure menuData and error from useMenuData hook
  const { menuData, error } = useMenuData();



  useEffect(() => {
    // Fetch full menu items from your data source
    fetchMenuItems();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedDiningHall(null); // Hide the image and buttons when search is active
  };

  const handleDiningHallClick = (diningHallName) => {
    setSelectedDiningHall(diningHallName);
    setSearchQuery(''); // Clear search query when a dining hall is selected
  };



  const clearSelection = () => {
    setSelectedDiningHall(null);
    setSearchQuery('');
  };

  if (error) {
    return <div>Error loading menu: {error}</div>;
  }

  // Define dining halls with positions
  const diningHalls = [
    {
      name: 'Cowell-Stevenson',
      top: '20%',
      left: '30%',
    },
    {
      name: 'Crown-Merrill',
      top: '25%',
      left: '40%',
    },
    // Add other dining halls with adjusted positions
  ];



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
      <h1 className="text-2xl mb-4">Menu</h1>
      <input
        type="text"
        placeholder="Search for food..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="border px-3 py-2 rounded w-full mb-4"
      />
      {(searchQuery !== '' || selectedDiningHall) && (
        <button
          onClick={clearSelection}
          className="mb-4 px-4 py-2 bg-gray-200 text-black rounded"
        >
          Back to Map
        </button>
      )}
      {searchQuery === '' && !selectedDiningHall ? (
        // Show the background image and buttons
        <div className="relative">
          <img src={backgroundImage} alt="UCSC Map" className="w-full" />
          {/* Overlay buttons */}
          {diningHalls.map((hall) => (
            <button
              key={hall.name}
              onClick={() => handleDiningHallClick(hall.name)}
              className="invisible-button"
              style={{
                top: hall.top,
                left: hall.left,
                width: '50px',
                height: '50px',
                position: 'absolute',
                borderRadius: '50%',
                opacity: 0,
                cursor: 'pointer',
              }}
              aria-label={`Select ${hall.name} Dining Hall`}
              >
                {/* Invisible button */}
            </button>
          ))}
        </div>
      ) : (
        // Show the menu items
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
      )}
    </div>
  );
};

export default Menu;
