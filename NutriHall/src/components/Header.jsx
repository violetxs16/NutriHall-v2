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
              className="btn btn-ghost btn-circle lg:w-7 lg:h-7 "
              onClick={handleMenuDropdownToggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="lg:h-8 lg:w-8"
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
                className="menu dropdown-content mt-3 p-4 shadow bg-secondary text-secondary-content rounded-box lg:w-64 z-50"
              >
                <li>
                  <NavLink
                    to="/food-diary"
                    className="flex items-center space-x-4 lg:text-lg"
                    onClick={handleLinkClick}
                  >
                    <img src={diaryImg} className="lg:w-2 lg:h-2" alt="Diary" />
                    <span>Food Diary</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/record-meal"
                    className="flex items-center space-x-4 lg:text-lg"
                    onClick={handleLinkClick}
                  >
                    <img src={mealImg} className="lg:w-2 lg:h-2" alt="Meal" />
                    <span>AI Meal Generation</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/menu"
                    className="flex items-center space-x-4 lg:text-lg "
                    onClick={handleLinkClick}
                  >
                    <img src={menuImg} className="lg:w-2 lg:h-2" alt="Menu" />
                    <span>Menu</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/history"
                    className="flex items-center space-x-4 lg:text-lg"
                    onClick={handleLinkClick}
                  >
                    <img src={historyImg} className="lg:w-2 lg:h-2" alt="History" />
                    <span>History</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings"
                    className="flex items-center space-x-4 lg:text-lg"
                    onClick={handleLinkClick}
                  >
                    <img src={settingsImg} className="lg:w-2 lg:h-2" alt="Settings" />
                    <span>Settings</span>
                  </NavLink>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Center Logo */}
        <div className="navbar-center">
          <NavLink
            to="/menu"
            className="btn btn-ghost normal-case text-3xl"
            onClick={handleLinkClick}
          >
            NutriHall
          </NavLink>
        </div>

        {/* Right Side Profile */}
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar lg:w-14 lg:h-14"
              onClick={handleProfileDropdownToggle}
            >
              <div className="lg:w-12 lg:h-12 rounded-full">
                <img alt="User" src={userImg} />
              </div>
            </button>
            {showProfileDropdown && (
              <ul
                tabIndex={0}
                className="menu dropdown-content mt-3 p-4 shadow bg-secondary text-secondary-content rounded-box lg:w-64 z-50"
              >
                <li>
                  <NavLink
                    to="/settings"
                    className="lg:text-lg"
                    onClick={handleLinkClick}
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <button
                    className="lg:text-lg"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
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
