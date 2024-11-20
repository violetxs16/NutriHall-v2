import React, { useState, useEffect, useContext } from 'react';
import { auth, database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import Navbar from '../components/Navbar';
import MenuItems from '../components/MenuItems';
import useMenuData from '../components/MenuData';
import backgroundImage from '../assets/ucsc_map.jpg';
import RestrictionHeader from '../components/RestrictionHeader';
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

  const width = useWindowWidth();

  useEffect(() => {
    // Fetch full menu items from your data source
    fetchMenuItems();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDiningHallClick = (diningHallName) => {
    setSelectedDiningHall(diningHallName);
    setSearchQuery(''); // Clear the search query when selecting a dining hall
  };

  const clearSelection = () => {
    setSelectedDiningHall(null);
    setSearchQuery(''); // Reset both search and dining hall selection
  };

  if (error) {
    return <div>Error loading menu: {error}</div>;
  }

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
        for (let restriction in preferences.dietaryRestrictions) {
          if (
            preferences.dietaryRestrictions[restriction] &&
            item.tags.includes(restriction)
          ) {
            return false;
          }
        }
        return true;
      });
      setFilteredItems(filtered);
    }
  }, [menuItems, preferences]);

  const fetchMenuItems = () => {
    setMenuItems(menuData);
  };

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
          <div
            className="relative w-full max-w-full z-10"
            style={{ maxHeight: '80vh', overflow: 'hidden' }}
          >
            <img
              src={backgroundImage}
              alt="UCSC Map"
              className="w-full h-auto"
              style={{ maxHeight: '80vh', objectFit: 'contain' }}
            />
            {diningHalls.map((hall) => (
              <button
                key={hall.name}
                onClick={() => handleDiningHallClick(hall.name)}
                className="invisible-button"
                style={{
                  top: hall.top,
                  left: hall.left,
                  width: '5%',
                  height: '0',
                  paddingBottom: '5%',
                  position: 'absolute',
                  borderRadius: '50%',
                  border: '2px solid red',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  opacity: 1,
                  cursor: 'pointer',
                  transform: 'translate(-50%, -50%)',
                }}
                aria-label={`Select ${hall.name} Dining Hall`}
              />
            ))}
          </div>
        ) : (
          <DiningHallButtons onDiningHallClick={handleDiningHallClick} />
        )
      ) : (
        <div className="p-6">
          <Navbar
            setAll={setAll}
            setBreakfast={setBreakfast}
            setLunch={setLunch}
            setDinner={setDinner}
            setShakes={setShakes}
            selectedDiningHall={selectedDiningHall}
            searchQuery={searchQuery}
          />
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
