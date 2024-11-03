// src/Components/Preferences.jsx
import React, { useState } from 'react';
import { css, jsx } from "@emotion/react";

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
    language: 'en',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences({
      ...preferences,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const savePreferences = (e) => {
    e.preventDefault();
    // Implement save functionality, e.g., API call or localStorage
    console.log('Preferences saved:', preferences);
    alert('Preferences have been saved!');
  };

  return (
    <div
      className="Preferences"
      css={css`
        padding: 20px;
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      `}
    >
      <h1>User Preferences</h1>
      <form onSubmit={savePreferences}>
        <div
          css={css`
            margin-bottom: 15px;
          `}
        >
          <label htmlFor="theme">Theme:</label>
          <select
            id="theme"
            name="theme"
            value={preferences.theme}
            onChange={handleChange}
            css={css`
              margin-left: 10px;
              padding: 5px;
              border-radius: 4px;
              border: 1px solid #ccc;
            `}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div
          css={css`
            margin-bottom: 15px;
          `}
        >
          <label htmlFor="notifications">Enable Notifications:</label>
          <input
            type="checkbox"
            id="notifications"
            name="notifications"
            checked={preferences.notifications}
            onChange={handleChange}
            css={css`
              margin-left: 10px;
              transform: scale(1.2);
            `}
          />
        </div>

        <div
          css={css`
            margin-bottom: 15px;
          `}
        >
          <label htmlFor="language">Language:</label>
          <select
            id="language"
            name="language"
            value={preferences.language}
            onChange={handleChange}
            css={css`
              margin-left: 10px;
              padding: 5px;
              border-radius: 4px;
              border: 1px solid #ccc;
            `}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            {/* Add more languages as needed */}
          </select>
        </div>

        <button
          type="submit"
          css={css`
            padding: 10px 20px;
            background: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;

            &:hover {
              background: #0056b3;
            }
          `}
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
};

export default Preferences;