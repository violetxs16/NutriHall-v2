// src/components/Header.jsx
import React from 'react';
import UserProfile from './UserProfile';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      {/* Other header content */}
      <UserProfile />
    </header>
  );
};

export default Header;
