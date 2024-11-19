import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import UserProfile from './UserProfile';
import { PreferencesContext } from '../contexts/PreferencesContext';

const Header = () => {
  const { temporaryPreferences, setTemporaryPreferences } = useContext(PreferencesContext);
  const [showPreferences, setShowPreferences] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

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

  // Handle menu toggle for mobile
  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-25 bg-gray-800 text-white z-20">
      {/* Top Row: Company Title, Centered Navigation Links, and User Profile */}
      <div className="flex items-center justify-between p-4">
        {/* Company Title */}
        <NavLink to="/menu" className="text-xl font-bold hover:underline">
          NutriHall
        </NavLink>

        {/* Navigation Links */}
        <div className="hidden md:flex flex-1 justify-center">
          <nav className="flex space-x-6 items-center">
            <NavLink to="/food-diary" className="py-2 hover:underline flex items-center">
              <img src="/assets/diary.png" alt="Diary Icon" className="w-5 h-5 mr-2" />
              Food Diary
            </NavLink>
            <NavLink to="/record-meal" className="py-2 hover:underline flex items-center">
              <img src="/assets/meal.png" alt="Meal Icon" className="w-5 h-5 mr-2" />
              Generate Meal
            </NavLink>
            <NavLink to="/history" className="py-2 hover:underline flex items-center">
              <img src="/assets/history.png" alt="History Icon" className="w-5 h-5 mr-2" />
              History
            </NavLink>
            <NavLink to="/menu" className="py-2 hover:underline flex items-center">
              <img src="/assets/menu.png" alt="Menu Icon" className="w-5 h-5 mr-2" />
              Menu
            </NavLink>
            <NavLink to="/settings" className="py-2 hover:underline flex items-center">
              <img src="/assets/settings.png" alt="Settings Icon" className="w-5 h-5 mr-2" />
              Settings
            </NavLink>
          </nav>
        </div>

        {/* User Profile */}
        <div className="hidden md:block">
          <UserProfile />
        </div>

        {/* Menu Button for Mobile */}
        <div className="md:hidden">
          <button
            ref={buttonRef}
            onClick={handleMenuToggle}
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Links for Mobile */}
      <nav
        ref={menuRef}
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:hidden flex flex-col items-center bg-gray-800 text-white`}
      >
        <NavLink to="/food-diary" className="py-2 hover:underline">
          Food Diary
        </NavLink>
        <NavLink to="/record-meal" className="py-2 hover:underline">
          Generate Meal
        </NavLink>
        <NavLink to="/history" className="py-2 hover:underline">
          History
        </NavLink>
        <NavLink to="/menu" className="py-2 hover:underline">
          Menu
        </NavLink>
        <NavLink to="/settings" className="py-2 hover:underline">
          Settings
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
