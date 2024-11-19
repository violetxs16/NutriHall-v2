// src/components/Settings.jsx
import React, { useContext, useState } from 'react';
import Preferences from '../components/Preferences';
import EditAccount from '../components/EditAccount';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('preferences');
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      auth.signOut();
      navigate('/login');
    }
  };

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl mb-4">Settings</h1>
      <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
        <button
          className={`px-4 py-2 mb-2 md:mb-0 ${
            activeTab === 'preferences' ? 'bg-gray-300' : ''
          }`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
        <button
          className={`px-4 py-2 mb-2 md:mb-0 ${
            activeTab === 'editAccount' ? 'bg-gray-300' : ''
          }`}
          onClick={() => setActiveTab('editAccount')}
        >
          Edit Account
        </button>
        <button onClick={toggleTheme} className="btn btn-ghost">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          className="px-4 py-2 text-red-500 mb-2 md:mb-0"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>

      {activeTab === 'preferences' && <Preferences />}
      {activeTab === 'editAccount' && <EditAccount />}
    </div>
  );
};

export default Settings;
