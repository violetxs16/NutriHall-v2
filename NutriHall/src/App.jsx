// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import { css, Global } from '@emotion/react';
// import Header from './components/Header.jsx';
// import { PreferencesProvider } from './contexts/PreferencesContext';
// import ThemeProvider from './contexts/ThemeContext';

// import './styles/App.css';

// // Components and Pages
// import Sidebar from './components/Sidebar.jsx';
// import Login from './components/Login.jsx';
// import Signup from './components/Signup.jsx';
// import RecordMeal from './components/RecordMeal.jsx';
// import History from './pages/History.jsx';
// import Menu from './pages/Menu.jsx';
// import LandingPage from './pages/LandingPage.jsx';
// import Settings from './pages/Settings.jsx';
// import PrivateRoute from './components/PrivateRoute.jsx';
// import FoodDiary from './pages/FoodDiary.jsx';

// function App() {

//   return (
//     <ThemeProvider>
//       <PreferencesProvider>
//         <Router>
//           <Header />
//           <div className="flex">
//             <div className="flex-grow bg-base-100 min-h-screen">
//               {/* Global Styling */}
//               <Global
//                 styles={css`
//                   @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap');

//                   ::selection {
//                     background: #000;
//                     color: #f0eff1;
//                   }

//                   * {
//                     margin: 0;
//                     padding: 0;
//                     box-sizing: border-box;
//                     font-family: 'Poppins', sans-serif;
//                     -webkit-tap-highlight-color: transparent;
//                   }

//                   body::-webkit-scrollbar {
//                     width: 12px;
//                   }

//                   body::-webkit-scrollbar-track {
//                     background: #f0eff1;
//                   }

//                   body::-webkit-scrollbar-thumb {
//                     background-color: #444444;
//                     border-radius: 20px;
//                     border: 3px solid #f0eff1;
//                   }

//                   body {
//                     background: #f0eff1;
//                   }

//                   .container {
//                     width: 80%;
//                     margin: auto;
//                   }
//                 `}
//               />

//               {/* Main Content with Top Padding */}
//               <div className="pt-16">
//                 {/* Define Routes */}
//                 <Routes>
//                   <Route path="/" element={<LandingPage />} />
//                   <Route path="/login" element={<Login />} />
//                   <Route path="/signup" element={<Signup />} />
//                   <Route
//                     path="/food-diary"
//                     element={
//                       <PrivateRoute>
//                         <FoodDiary />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/record-meal"
//                     element={
//                       <PrivateRoute>
//                         <RecordMeal />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route
//                     path="/history"
//                     element={
//                       <PrivateRoute>
//                         <History />
//                       </PrivateRoute>
//                     }
//                   />
//                   <Route path="/menu" element={<Menu />} />
//                   <Route path="/landingpage" element={<LandingPage />} />
//                   <Route
//                     path="/settings"
//                     element={
//                       <PrivateRoute>
//                         <Settings />
//                       </PrivateRoute>
//                     }
//                   />
//                 </Routes>
//               </div>
//             </div>
//           </div>
//         </Router>
//       </PreferencesProvider>
//     </ThemeProvider>
//   );
// }

// export default App;























import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { css, Global } from '@emotion/react';
import Header from './components/Header.jsx';
import { PreferencesProvider } from './contexts/PreferencesContext';
import ThemeProvider from './contexts/ThemeContext';

import './styles/App.css';

// Components and Pages
import Sidebar from './components/Sidebar.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import RecordMeal from './components/RecordMeal.jsx';
import History from './pages/History.jsx';
import Menu from './pages/Menu.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Settings from './pages/Settings.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import FoodDiary from './pages/FoodDiary.jsx';

// Component to handle routes and conditional rendering
function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <>
      {!isLandingPage && <Header />}
      <div className="flex">
        <div className="flex-grow bg-base-100 min-h-screen">
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

              body {
                background: ${isLandingPage ? '#ffffff' : '#f0eff1'};
              }

              body::-webkit-scrollbar {
                width: ${isLandingPage ? '0' : '12px'};
              }

              body::-webkit-scrollbar-track {
                background: ${isLandingPage ? 'transparent' : '#f0eff1'};
              }

              body::-webkit-scrollbar-thumb {
                background-color: ${isLandingPage ? 'transparent' : '#444444'};
                border-radius: ${isLandingPage ? '0' : '20px'};
                border: ${isLandingPage ? 'none' : '3px solid #f0eff1'};
              }

              .container {
                width: 80%;
                margin: auto;
              }
            `}
          />

          {/* Main Content with Top Padding */}
          <div className={isLandingPage ? '' : 'pt-16'}>
            {/* Define Routes */}
            <Routes>
              <Route path="/" element={<LandingPage />} />
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
              <Route path="/landingpage" element={<LandingPage />} />
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
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <Router>
          <AppContent />
        </Router>
      </PreferencesProvider>
    </ThemeProvider>
  );
}

export default App;
