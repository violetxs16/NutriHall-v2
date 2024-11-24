// src/components/MenuData.js
import { useState, useEffect } from 'react';
import { database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';

const useMenuData = () => {
  const [menuData, setMenuData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const menuRef = ref(database, 'food');
    const unsubscribe = onValue(
      menuRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log('Data fetched from Firebase:', data);
          const menuArray = Object.values(data);
          setMenuData(menuArray);
        } else {
          console.log('No data available');
          setMenuData([]);
        }
      },
      (error) => {
        console.error('Error fetching menu data:', error);
        setError(error);
      }
    );

    return () => unsubscribe();
  }, []);

  return { menuData, error };
};

export default useMenuData;