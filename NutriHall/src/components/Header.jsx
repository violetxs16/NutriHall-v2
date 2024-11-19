// src/components/Header.jsx
import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import UserProfile from './UserProfile';
import { PreferencesContext } from '../contexts/PreferencesContext';
import userImg from '../assets/user.jpg';
import diaryImg from '../assets/Diary.png';
import mealImg from '../assets/Meal.png';
import menuImg from '../assets/Menu.png';
import historyImg from '../assets/History.png';
import settingsImg from '../assets/settings.png';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { temporaryPreferences, setTemporaryPreferences } = useContext(PreferencesContext);
  const [showPreferences, setShowPreferences] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const togglePreferences = () => {
    setShowPreferences((prev) => !prev);
  };

  const handleDropdownToggle = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLinkClick = () => {
    setShowDropdown(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      auth.signOut();
      NavLink('/login');
    }
  }

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
    <header className="fixed top-0 left-0 right-0 z-25 flex flex-col text-white bg-gray-800">
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" onClick={handleDropdownToggle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            {showDropdown && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1050] mt-3 w-52 p-2 shadow">
                <li><a onClick={handleLinkClick}><NavLink to="/food-diary" className="flex items-center space-x-2"><img src={diaryImg} className="w-6 h-6"/> Food Diary</NavLink></a></li>
                <li><a onClick={handleLinkClick}><NavLink to="/record-meal" className="flex items-center space-x-2"><img src={mealImg} className="w-6 h-6"/> AI Meal Generation</NavLink></a></li>
                <li><a onClick={handleLinkClick}><NavLink to="/menu" className="flex items-center space-x-2"><img src={menuImg} className="w-6 h-6"/> Menu</NavLink></a></li>
                <li><a onClick={handleLinkClick}><NavLink to="/history" className="flex items-center space-x-2"><img src={historyImg} className="w-6 h-6"/> History</NavLink></a></li>
                <li><a onClick={handleLinkClick}><NavLink to="/settings" className="flex items-center space-x-2"><img src={settingsImg} className="w-6 h-6"/> Settings</NavLink></a></li>
              </ul>
            )}
          </div>
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl" onClick={handleLinkClick}><NavLink to="/menu">NutriHall</NavLink></a>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar" onClick={handleDropdownToggle}>
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={userImg} />
              </div>
            </div>
            {showDropdown && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li>
                  <a className="justify-between" onClick={handleLinkClick}>
                  <NavLink to="/settings">Profile</NavLink>
                  </a>
                </li>
                <li><a onClick={handleLogout}>Logout</a></li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;