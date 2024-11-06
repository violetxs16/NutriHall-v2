// src/Pages/Menu.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import MenuItems from '../components/MenuItems';
import useMenuData from '../components/MenuData';
import '../styles/main.css'

const Menu = () => {
  const [all, setAll] = useState(true);
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [shakes, setShakes] = useState(false);

  // Destructure menuData and error from useMenuData hook
  const { menuData, error } = useMenuData();

  return (
    <div>
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
    </div>
  );
};

export default Menu;
