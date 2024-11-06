// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { css, Global } from "@emotion/react";
import './styles/app.css';

// Components and Pages
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Signup from './components/Signup';
import RecordMeal from './components/RecordMeal';
import History from './Pages/History';
import Menu from './Pages/Menu';
import Settings from './Pages/Settings';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar component */}
        <Sidebar />

        <div className="flex-grow ml-64">
          {/* Global Styling */}
          <Global
            styles={css`
              @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap");

              ::selection {
                background: #000;
                color: #f0eff1;
              }

              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: "Poppins", sans-serif;
                --webkit-tap-highlight-color: transparent;
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

          {/* Define Routes */}
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
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
    </Router>
  );
}

export default App;
