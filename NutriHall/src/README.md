# NutriHall Documentation

## Project Overview

NutriHall is a web application designed to assist users in managing their food preferences, tracking meals, and generating dietary insights. The application integrates Firebase for user authentication and data storage.

---

## `src` Folder and File Structure
The root folder of the application contains all the core files and subdirectories.

### `assets`
This folder contains all the images and assets used throughout the project.

- `alcohol.gif`, `beef.gif`, etc.: GIFs representing dietary restrictions.
- `Diary.png`, `Meal.png`, etc.: PNGs representing icons used for navigation.

---

### `components`
Reusable components used across the project.

- **`Buttons.jsx`**  
  Contains reusable button components for various UI interactions.

- **`EditAccount.jsx`**  
  Allows users to update their account information (e.g., username, password, or preferences).

- **`Header.jsx`**  
  The main header/navigation bar component. Includes navigation links and responsive design for mobile views.

- **`InputField.jsx`**  
  A reusable input field component for forms (e.g., login, signup, preferences).

- **`Login.jsx`**  
  Handles the login form and Firebase authentication logic for user sign-in.

- **`MenuAll.jsx`**  
  Displays the menu for all available meal options while applying filters based on dietary restrictions.

- **`MenuBreakfast.jsx`**  
  Displays the breakfast menu, filtered by user preferences.

- **`MenuData.jsx`**  
  A data-fetching utility for loading menu data dynamically.

- **`MenuItems.jsx`**  
  Handles the rendering and layout of all menu items across categories.

- **`MenuLunch.jsx`**  
  Displays the lunch menu with preference-based filtering.

- **`MenuShakes.jsx`**  
  Displays shake menu options filtered by dietary restrictions.

- **`Navbar.jsx`**  
  Handles the sidebar or top navigation bar with links to other pages.

- **`Preferences.jsx`**  
  Allows users to set their dietary restrictions and calorie preferences.

- **`PrivateRoute.jsx`**  
  A higher-order component that ensures only authenticated users can access specific routes.

- **`RecordMeal.jsx`**  
  Enables users to log a meal and store it in their meal history.

- **`RestrictionHeader.jsx`**  
  Displays selected dietary restrictions in a user-friendly layout.

- **`Sidebar.jsx`**  
  Handles the vertical sidebar navigation for desktop views.

- **`Signup.jsx`**  
  Allows new users to create an account with Firebase authentication.

- **`UserProfile.jsx`**  
  Displays the user’s profile and allows logout functionality.

---

### `contexts`
Provides context APIs for managing application state.

- **`PreferencesContext.jsx`**  
  Handles the global state for dietary preferences and calorie settings.

- **`ThemeContext.jsx`** *(Deprecated)*  
  Managed the global theme for the application (currently being removed).

---

### `pages`
Individual pages of the application, each representing a specific route.

- **`FoodDiary.jsx`**  
  Displays the user's food diary, where they can see previously logged meals.

- **`GenerateMeal.jsx`**  
  Provides meal suggestions based on user preferences and calorie range.

- **`History.jsx`**  
  Displays the user’s meal history with filtering options.

- **`Menu.jsx`**  
  The main menu page showing all available dining hall options and meal categories.

- **`Settings.jsx`**  
  Allows users to update app settings, such as theme and account preferences.

---

### `styles`
Holds CSS files for styling the application.

- **`App.css`**  
  Global styles for the application.

- **`FoodDiary.css`**  
  Specific styles for the Food Diary page.

- **`Header.css`**  
  Styles for the Header component, including responsiveness.

- **`main.css`**  
  Additional utility styles for the project.

---

### `utils`
Helper functions and utilities for the application.

- **`calorieCalculator.js`**  
  Contains a utility function to calculate the calorie range based on user weight, height, age, and goal.

---

### Root Files

- **`App.jsx`**  
  The main component that renders all routes and initializes the application.

- **`firebaseConfig.js`**  
  Configuration file for Firebase, including authentication and database setup.

- **`main.jsx`**  
  Entry point of the application. Mounts the `App` component onto the root element.

- **`README.md`**  
  Documentation file explaining the project and its structure.

- **`reportWebVitals.js`**  
  A performance monitoring tool for the application.

- **`setupTests.js`**  
  Test setup file for Jest or other testing frameworks.

---

## Running the Project

1. **Install dependencies**  
   ```bash
   npm install
