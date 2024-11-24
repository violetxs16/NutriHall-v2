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
      />
    </div>
  );
};

export default MenuItems;
