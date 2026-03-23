## AHFUL Application -- Frontend Technical Documentation

This directory holds all information required for the Frontend to render and load for the user.  
Key components:
All Navigation Pages for the user
Custom Auth Context component for persistent authentication

## Setup Instructions
1. **Install Dependencies**:
    - In vscode, open a terminal (ctrl + ~) 
        Navigat to the Frontend folder then run the following: 
        
        ```bash
        npm install
        npm run dev
        #Use Ctrl+C to terminate development process.
        ```

2. **Access the Application**:
    - Open your browser and navigate to `http://localhost:5173`.

### CSS Information
  -Start with theme pages under Stylesheets/Themes/
  -Use design tokens (var(--...)) for all colors, text, borders, spacing, etc.
  -Never hardcode colors or font sizes
  -Structure layouts using flexbox or grid
  -Keep components consistent (background, border, radius, shadow)
  -Use padding for internal spacing, margin for separation
  -Avoid stacking large vertical padding (prevents “extra lines”)
  -Let .dark handle dark mode automatically (don’t duplicate styles)
  -Reuse existing classes before creating new ones
  -Keep styles modular (component-specific CSS files)
  -Follow consistent naming (.component-name, .component-element)
  -Test styles in both different color modes before finalizing


### Frontend Directory Structure

```
frontend/
├── .env.                                           !!! You will need to create this
├── biome.json
├── index.html                                      --- Inital Entery Point into Application
├── package-lock.json
├── package.json
├── README.md                                       --- You Are Here
├── vite.config.js                                  --- Vite Config
├── images/                                         ### Images Dir
│   ├── Flex.ico                                    --- Tab Icon
│   └── heatmap.png
├── public/                                         ### Public File Dir (for Firebase)
│   └── firebase-messaging-sw.js                    --- Service Worker functions for Firebase        
└── src/                                            ### All Source Components Dir
    ├── AHFULApp.jsx                                --- Holds GoogleOAuthProvider and Pages
    ├── AuthRouteCheck.jsx
    ├── Firebase.jsx                                --- Sets up Firebase and contains registrations for service workers
    ├── Layout.jsx                                  --- Navigation Setup and Template for Mobile
    ├── Main.jsx                                    --- Main App Entry Point, Holds Redux and Router Wrappers
    ├── QueryFunctions.js                           --- Frontend Wide Accessible functions (Fetches)
    ├── SiteStyles.css                              --- Frontend Wide Accessible Style Sheet
    ├── Store.jsx                                   --- Redux Store
    ├── components/                                 ### Page Components Dir
    │   ├── Calendar/                               ### Calendar Component Dir
    │   │   ├── Calendar.css
    │   │   ├── Calendar.jsx
    │   │   ├── CalendarSlicer.jsx
    │   │   └── UseCalendar.js
    │   ├── CalendarButton/                         ### Calendar Button Dir
    │   │   ├── CalendarButton.css
    │   │   └── CalendarButton.jsx
    │   ├── DashboardComponents/
    │   │   └── DashboardComponentsTodo/
    │   │       ├── DashboardFoodTodoItem.jsx
    │   │       ├── DashboardFoodTodoList.jsx
    │   │       ├── DashboardTodo.css
    │   │       ├── DashboardWorkoutTodoItem.jsx
    │   │       └── DashboardWorkoutTodoList.jsx
    │   ├── HeatMap/
    │   │   ├── HeatMap.css
    │   │   └── HeatMap.jsx
    │   ├── MenuButton/                             ### Menu Button Compnent Dir
    │   │   ├── MenuButton.css
    │   │   └── MenuButton.jsx
    │   ├── navbar/                                 ### Navbar Button Compnent Dir
    │   │   ├── navbar.css
    │   │   ├── navbar.jsx
    │   │   └── navbarSlicer.jsx
    │   ├── ProfileSettings/                        ### Profile Settings Button Compnent Dir
    │   │   ├── ProfileSettings.css
    │   │   ├── ProfileSettings.jsx
    │   │   ├── ProfileSettingsPopup.jsx
    │   │   └── ProfileSettingsSlice.jsx
    │   └── WorkoutHistory/                         ### Workout History Component Dir
    │       ├── WorkoutHistory.css
    │       └── WorkoutHistory.jsx
    └── Pages/                                      ### AHFUL Navigatable Pages Dir
        ├── Dashboard/
        │   ├── Dashboard.css
        │   └── Dashboard.jsx
        ├── ExploreWorkouts/
        │   ├── ExploreWorkouts.css
        │   └── ExploreWorkouts.jsx
        ├── FoodLog/
        │   ├── FoodLog.css
        │   └── FoodLog.jsx
        ├── Login/
        │   ├── AuthSlice.jsx
        │   ├── CustSnapButton.jsx
        │   ├── Login.css
        │   ├── Login.jsx
        │   └── LoginFunctions.jsx
        ├── Map/
        │   ├── Map.css
        │   └── Map.jsx
        ├── MeasurementLogger/
        │   ├── MeasurementLogger.css
        │   └── MeasurementLogger.jsx
        ├── Profile/
        │   ├── Profile.css
        │   └── Profile.jsx
        ├── TOS/
        │   ├── TOS.css
        │   └── TOS.jsx
        └── WorkoutLogger/
            ├── WorkoutLogger.css
            └── WorkoutLogger.jsx

```
