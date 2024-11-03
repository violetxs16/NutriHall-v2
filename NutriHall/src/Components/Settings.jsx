// src/Components/Settings.jsx
import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    language: 'en',
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const saveSettings = () => {
    // Save settings logic
    console.log('Settings saved:', settings);
  };

  return (
    <div>
      <h1>Settings</h1>
      <form>
        <label>
          Enable Notifications:
          <input
            type="checkbox"
            name="notifications"
            checked={settings.notifications}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Language:
          <select name="language" value={settings.language} onChange={handleChange}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            {/* Add more languages as needed */}
          </select>
        </label>
        <br />
        <button type="button" onClick={saveSettings}>Save</button>
      </form>
    </div>
  );
};

export default Settings;