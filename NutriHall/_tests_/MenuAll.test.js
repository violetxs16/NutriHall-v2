// MenuAll.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import MenuAll from './MenuAll';
import { PreferencesContext } from '../contexts/PreferencesContext';

test('renders correctly and button can be clicked', () => {
  const items = [{ name: 'Salad', dietaryRestrictions: [], diningHalls: [], mealPeriods: [] }];
  render(
    <PreferencesContext.Provider value={{ temporaryPreferences: {} }}>
      <MenuAll items={items} />
    </PreferencesContext.Provider>
  );
  
  const button = screen.getByRole('button', { name: /record meal/i });
  fireEvent.click(button);
  expect(button).toHaveClass('bg-green-600');
});
