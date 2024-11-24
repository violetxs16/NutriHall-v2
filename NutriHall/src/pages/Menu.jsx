// src/Pages/Menu.jsx
import React, { useState, useEffect, useContext } from 'react';
import { auth, database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Navbar from '../components/Navbar';
import MenuItems from '../components/MenuItems';
import useMenuData from '../components/MenuData';
import backgroundImage from '../assets/ucsc_map.jpg';
import RestrictionHeader from '../components/RestrictionHeader';
import { PreferencesContext } from '../contexts/PreferencesContext';
import DiningHallButtons from '../components/DiningHallButtons';
import '../styles/main.css';

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [all, setAll] = useState(true);
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiningHall, setSelectedDiningHall] = useState(null);

  const user = auth.currentUser;

  const { temporaryPreferences } = useContext(PreferencesContext);

  // Destructure menuData and error from useMenuData hook
  const { menuData, error } = useMenuData();

  
  const width = useWindowWidth();

  useEffect(() => {
    console.log('Menu Data from useMenuData:', menuData);
  }, [menuData]);

  useEffect(() => {
    console.log('Menu Items in Menu.jsx:', menuItems);
  }, [menuItems]);

  useEffect(() => {
    if (menuData) {
      setMenuItems(menuData);
    }
  }, [menuData]);


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

  // Define dining halls with positions (use numbers without quotes)
  const diningHalls = [
    {
      name: 'Cowell & Stevenson',
      top: 61,
      left: 88,
    },
    {
      name: 'Crown & Merrill',
      top: 14,
      left: 88,
    },
    {
      name: 'John R. Lewis & College Nine',
      top: 16,
      left: 62,
    },
    {
      name: 'Rachel Carson & Oakes',
      top: 71,
      left: 42,
    },
    {
      name: 'Porter & Kresge',
      top: 47,
      left: 10,
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



  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Menu</h1>
      {/* Search Bar and Restrictions */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search for food..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="input input-bordered bg-white text-black flex-grow"
        />
        <RestrictionHeader />
      </div>

      {(searchQuery !== '' || selectedDiningHall) && (
        <div className="flex justify-start items-center mb-4">
          <button
            onClick={clearSelection}
            className="btn bg-blue-800 text-white hover:bg-blue-900 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Back to Map
          </button>
        </div>
      )}

      {searchQuery === '' && !selectedDiningHall ? (
        width >= 1000 ? (
          // Show the background image and buttons (Map)
          <div className="flex justify-center">
            <div
              className="map-container relative"
              style={{ width: '80%', maxWidth: '1000px', position: 'relative' }}
            >
              <img
                src={backgroundImage}
                alt="UCSC Map"
                className="w-full h-auto block"
              />
              {/* Overlay buttons */}
              {diningHalls.map((hall) => (
                <button
                  key={hall.name}
                  onClick={() => handleDiningHallClick(hall.name)}
                  className="absolute btn btn-primary btn-circle opacity-0 hover:opacity-20 transition duration-200 ease-in-out transform hover:scale-110"
                  style={{
                    top: `${hall.top}%`,
                    left: `${hall.left}%`,
                    width: '8rem',
                    height: '8rem',
                    borderRadius: '50%',


                    cursor: 'pointer',
                    transform: 'translate(-50%, -50%)',
                  }}
                  aria-label={`Select ${hall.name} Dining Hall`}
                />
              ))}
            </div>
          </div>
        ) : (
          // Show DiningHallButtons component on small screens
          <DiningHallButtons onDiningHallClick={handleDiningHallClick} />
        )
      ) : (
        // Show the menu items
        <div className="p-6">
          {/* Navbar Component */}
          <Navbar
            setAll={setAll}
            setBreakfast={setBreakfast}
            setLunch={setLunch}
            setDinner={setDinner}
            selectedDiningHall={selectedDiningHall}
            all={all}
            breakfast={breakfast}
            lunch={lunch}
            dinner={dinner}
          />
          {/* MenuItems Component */}
          <MenuItems
            items={menuItems}
            searchQuery={searchQuery}
            selectedDiningHall={selectedDiningHall}
            all={all}
            breakfast={breakfast}
            lunch={lunch}
            dinner={dinner}
            onDiningHallClick={handleDiningHallClick}
          />
        </div>
      )}
    </div>
  );
};

export default Menu;
