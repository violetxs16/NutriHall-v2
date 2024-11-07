// src/contexts/PreferencesContext.js
import React, { createContext, useState } from 'react';

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [temporaryPreferences, setTemporaryPreferences] = useState({
    dietaryRestrictions: {},
    calorieRange: 2000,
    goal: 'default',
  });

  return (
    <PreferencesContext.Provider
      value={{ temporaryPreferences, setTemporaryPreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

