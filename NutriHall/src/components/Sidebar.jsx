// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const linkClasses =
    'block py-2.5 px-4 hover:bg-gray-700 transition duration-200';

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed">
      <nav className="mt-10">
        <NavLink to="/record-meal" className={linkClasses}>
          Record Meal
        </NavLink>
        <NavLink to="/history" className={linkClasses}>
          History
        </NavLink>
        <NavLink to="/menu" className={linkClasses}>
          Menu
        </NavLink>
        <NavLink to="/settings" className={linkClasses}>
          Settings
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
