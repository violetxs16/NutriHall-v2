// src/components/Settings.jsx
import React, { useState } from 'react';
import Preferences from '../components/Preferences';
import EditAccount from '../components/EditAccount';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('preferences');
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      auth.signOut();
      navigate('/login');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Settings</h1>
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === 'preferences' ? 'bg-gray-300' : ''
          }`}
          onClick={() => setActiveTab('preferences')}
        >
          Preferences
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === 'editAccount' ? 'bg-gray-300' : ''
          }`}
          onClick={() => setActiveTab('editAccount')}
        >
          Edit Account
        </button>
        <button
          className="px-4 py-2"
          onClick={() => {
            document.documentElement.classList.toggle('dark');
          }}
        >
          Toggle Dark Mode
        </button>
        <button className="px-4 py-2 text-red-500" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {activeTab === 'preferences' && <Preferences />}
      {activeTab === 'editAccount' && <EditAccount />}
    </div>
  );
};

export default Settings;
