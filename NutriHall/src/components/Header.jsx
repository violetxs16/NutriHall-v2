import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PreferencesContext } from '../contexts/PreferencesContext';
import userImg from '../assets/user.jpg';
import diaryImg from '../assets/Diary.png';
import mealImg from '../assets/Meal.png';
import menuImg from '../assets/Menu.png';
import historyImg from '../assets/History.png';
import settingsImg from '../assets/settings.png';
import { auth } from '../firebaseConfig';

const Header = () => {
  const { temporaryPreferences, setTemporaryPreferences } = useContext(PreferencesContext);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const handleMenuDropdownToggle = () => {
    setShowMenuDropdown((prev) => !prev);
    if (showProfileDropdown) setShowProfileDropdown(false); // Close the profile dropdown if open
  };

  const handleProfileDropdownToggle = () => {
    setShowProfileDropdown((prev) => !prev);
    if (showMenuDropdown) setShowMenuDropdown(false); // Close the menu dropdown if open
  };

  const handleLinkClick = () => {
    setShowMenuDropdown(false);
    setShowProfileDropdown(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      auth.signOut();
      navigate('/login');
    }
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-base-100 text-base-content">
      <div className="navbar">
        {/* Left Side Menu */}
        <div className="navbar-start">
          <div className="dropdown">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-circle"
              onClick={handleMenuDropdownToggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {showMenuDropdown ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            {showMenuDropdown && (
              <ul
                tabIndex={0}
                className="menu dropdown-content mt-3 p-2 shadow bg-secondary text-secondary-content rounded-box w-52 z-50"
              >
                <li>
                  <NavLink
                    to="/food-diary"
                    className="flex items-center space-x-2"
                    onClick={handleLinkClick}
                  >
                    <img src={diaryImg} className="w-6 h-6" alt="Diary" />
                    <span>Food Diary</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/record-meal"
                    className="flex items-center space-x-2"
                    onClick={handleLinkClick}
                  >
                    <img src={mealImg} className="w-6 h-6" alt="Meal" />
                    <span>AI Meal Generation</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/menu"
                    className="flex items-center space-x-2"
                    onClick={handleLinkClick}
                  >
                    <img src={menuImg} className="w-6 h-6" alt="Menu" />
                    <span>Menu</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/history"
                    className="flex items-center space-x-2"
                    onClick={handleLinkClick}
                  >
                    <img src={historyImg} className="w-6 h-6" alt="History" />
                    <span>History</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings"
                    className="flex items-center space-x-2"
                    onClick={handleLinkClick}
                  >
                    <img src={settingsImg} className="w-6 h-6" alt="Settings" />
                    <span>Settings</span>
                  </NavLink>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Center Logo */}
        <div className="navbar-center">
          <NavLink to="/menu" className="btn btn-ghost normal-case text-xl" onClick={handleLinkClick}>
            NutriHall
          </NavLink>
        </div>

        {/* Right Side Profile */}
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar"
              onClick={handleProfileDropdownToggle}
            >
              <div className="w-10 rounded-full">
                <img alt="User" src={userImg} />
              </div>
            </button>
            {showProfileDropdown && (
              <ul
                tabIndex={0}
                className="menu dropdown-content mt-3 p-2 shadow bg-secondary text-secondary-content rounded-box w-52 z-50"
              >
                <li>
                  <NavLink to="/settings" onClick={handleLinkClick}>
                    Profile
                  </NavLink>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
