// __tests__/Login.test.jsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Login from '../src/Components/Login';  // Adjust this path if needed
import { MemoryRouter } from 'react-router-dom';

test('renders Login component', () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  expect(screen.getByText('Login')).toBeInTheDocument();
});
