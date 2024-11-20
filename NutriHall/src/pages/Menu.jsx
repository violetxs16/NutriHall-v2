// src/Pages/Menu.jsx
import React, { useState, useEffect, useContext } from 'react';
import { auth, database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Navbar from '../components/Navbar';
import MenuItems from '../components/MenuItems';
import useMenuData from '../components/MenuData';
import MenuAll from '../components/MenuAll';
import backgroundImage from '../assets/ucsc_map.jpg';
import RestrictionHeader from '../components/RestrictionHeader';
import { PreferencesContext } from '../contexts/PreferencesContext';
import '../styles/main.css'

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [all, setAll] = useState(true);
  const [breakfast, setBreakfast] = useState(true);
  const [lunch, setLunch] = useState(true);
  const [dinner, setDinner] = useState(true);
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
      name: 'Cowell-Stevenson Dining Hall',
      top: '48%',
      left: '80%',
    },
    {
      name: 'Crown-Merrill Dining Hall',
      top: '32%',
      left: '72%',
    },
    {
      name: 'College Nine/John R Lewis Dining Hall',
      top: '20%',
      left: '65%',
    },
    {
      name: 'Rachel Carson/Oakes Dining Hall',
      top: '60%',
      left: '45%',
    },
    {
      name: 'Porter/Kresge Dining Hall',
      top: '58%',
      left: '35%',
    },
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
      {/* Adjusted margin-top to account for fixed header height */}
      <h1 className="text-2xl mb-4">Menu</h1>
      <input
        type="text"
        placeholder="Search for food..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="input input-bordered w-full mb-4 bg-white text-black"
      />
      {(searchQuery !== '' || selectedDiningHall) && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <button onClick={clearSelection}   className="btn bg-blue-800 text-white hover:bg-blue-900 transition duration-200 ease-in-out transform hover:scale-105">
              Back to Map
            </button>
            <RestrictionHeader />
          </div>
        </div>
      )}
      {searchQuery === '' && !selectedDiningHall ? (
        // Show the background image and buttons
        <div className="relative w-full max-w-full z-10" style={{ maxHeight: '80vh', overflow: 'hidden' }}>
          <img
            src={backgroundImage}
            alt="UCSC Map"
            className="w-full h-auto"
            style={{ maxHeight: '80vh', objectFit: 'contain' }}
          />
          {/* Overlay buttons */}
          {diningHalls.map((hall) => (
            <button
              key={hall.name}
              onClick={() => handleDiningHallClick(hall.name)}
              className="invisible-button"
              style={{
                top: hall.top,
                left: hall.left,
                width: '5%', // Use percentage for width
                height: '0',
                paddingBottom: '5%', // To maintain square aspect ratio
                position: 'absolute',
                borderRadius: '50%',
                border: '2px solid red', // Red border for clear boundaries
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                opacity: 1,
                cursor: 'pointer',
                transform: 'translate(-50%, -50%)', // Center the button
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
          setDinner={setDinner}
          setShakes={setShakes}
        />
        {/* MenuItems Component */}
        <MenuItems
          items={menuData}
          all={all}
          breakfast={breakfast}
          lunch={lunch}
          dinner={dinner}
          shakes={shakes}
          searchQuery={searchQuery}
          selectedDiningHall={selectedDiningHall}
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
