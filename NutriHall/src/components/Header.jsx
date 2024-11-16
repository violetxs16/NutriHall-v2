// src/components/Header.jsx
import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import UserProfile from './UserProfile';
import { PreferencesContext } from '../contexts/PreferencesContext';

const Header = () => {
  const { temporaryPreferences, setTemporaryPreferences } = useContext(PreferencesContext);
  const [showPreferences, setShowPreferences] = useState(true);

  const togglePreferences = () => {
    setShowPreferences((prev) => !prev);
  };

  // Load saved preferences on refresh
  useEffect(() => {
    const savedPreferences = JSON.parse(localStorage.getItem('preferences'));
    if (savedPreferences) {
      setTemporaryPreferences(savedPreferences);
    }
  }, [setTemporaryPreferences]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('preferences', JSON.stringify(temporaryPreferences));
  }, [temporaryPreferences]);

  return (
    <header className="fixed top-0 left-0 right-0 z-25 flex flex-col bg-gray-800 text-white">
      {/* Top Row: Company Title, Centered Navigation Links, and User Profile */}
      <div className="flex items-center justify-between p-4">
        {/* Company Title */}
        <div className="text-xl font-bold mr-4">NutriHall</div>

        {/* Centered Navigation Links */}
        <nav className="flex space-x-4 mx-auto">
          <NavLink to="/food-diary" className="hover:underline">
            Food Diary
          </NavLink>
          <NavLink to="/record-meal" className="hover:underline">
            Generate Meal
          </NavLink>
          <NavLink to="/history" className="hover:underline">
            History
          </NavLink>
          <NavLink to="/menu" className="hover:underline">
            Menu
          </NavLink>
          <NavLink to="/settings" className="hover:underline">
            Settings
          </NavLink>
        </nav>

        {/* User Profile */}
        <UserProfile />
      </div>

      {/* Search Bar and Preferences */}
      <div className="p-1">
        {showPreferences && (
          <div className="">
            {/* Maybe Preferences Content */}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
