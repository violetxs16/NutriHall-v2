import { useState, useEffect } from "react";
import { database } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';

const useMenuData = () => {
  const [menuData, setMenuData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const mealsRef = ref(database, 'food');

    onValue(
      mealsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          const mealList = Object.entries(data).map(([id, item]) => ({
            id, // unique Firebase key
            title: item.name || "Untitled",
            category: item.category || "uncategorized",
            price: item.price || 0,
            desc: item.description || "No description available",
            restrictions: item.restrictions || [], // Add restrictions
          }));

          setMenuData(mealList);
        } else {
          setMenuData([]);
        }
      },
      (error) => {
        setError("Error fetching data");
        console.error(error);
      }
    );
  }, []);

  return { menuData, error };
};

export default useMenuData;
