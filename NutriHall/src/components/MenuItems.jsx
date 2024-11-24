// src/components/MenuItems.jsx
import React from 'react';
import MenuAll from './MenuAll';

const MenuItems = ({
  items,
  searchQuery,
  selectedDiningHall,
  all,
  breakfast,
  lunch,
  dinner,
  onDiningHallClick,
}) => {
  return (
    <div className="menu-items-container">
      <MenuAll
        items={items}
        searchQuery={searchQuery}
        selectedDiningHall={selectedDiningHall}
        all={all}
        breakfast={breakfast}
        lunch={lunch}
        dinner={dinner}
        onDiningHallClick={onDiningHallClick}
      />
    </div>
  );
};

export default MenuItems;
