// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { css, Global } from '@emotion/react';
import Header from './components/Header.jsx';
import './styles/App.css';
import { PreferencesProvider } from './contexts/PreferencesContext';

// Components and Pages
import Sidebar from './components/Sidebar.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import RecordMeal from './components/RecordMeal.jsx';
import History from './ages/History';
import Menu from './pages/Menu';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute.jsx';
import FoodDiary from './pages/FoodDiary';

function App() {
  return (
    <PreferencesProvider>
      <Router>
        <Header />
        <div className="flex">
          {/* Sidebar component */}
          <Sidebar />
          <div className="flex-grow ml-64">
            {/* Global Styling */}
            <Global
              styles={css`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap');

                ::selection {
                  background: #000;
                  color: #f0eff1;
                }

                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  font-family: 'Poppins', sans-serif;
                  -webkit-tap-highlight-color: transparent;
                }

                body::-webkit-scrollbar {
                  width: 12px;
                }

                body::-webkit-scrollbar-track {
                  background: #f0eff1;
                }

                body::-webkit-scrollbar-thumb {
                  background-color: #444444;
                  border-radius: 20px;
                  border: 3px solid #f0eff1;
                }

                body {
                  background: #f0eff1;
                }

                .container {
                  width: 80%;
                  margin: auto;
                }
              `}
            />

            {/* Main Content with Top Padding */}
            <div className="pt-16">
              {/* Define Routes */}
              <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/food-diary"
                  element={
                    <PrivateRoute>
                      <FoodDiary />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/record-meal"
                  element={
                    <PrivateRoute>
                      <RecordMeal />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <PrivateRoute>
                      <History />
                    </PrivateRoute>
                  }
                />
                <Route path="/menu" element={<Menu />} />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </PreferencesProvider>
  );
}

export default App;
