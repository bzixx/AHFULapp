## AHFUL Application -- Frontend Technical Documentation

This directory holds all information required for the Frontend to render and load for the user.  
Key components:
All Navigation Pages for the user
Custom Auth Context component for persistent authentication

### Frontend Directory Structure

```
frontend/
├── .env
├── biome.json
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── vite.config.js
├── images/
│   ├── Flex.ico
│   └── heatmap.png
└── src/
    ├── AHFULApp.jsx
    ├── layout.jsx
    ├── main.jsx
    ├── siteStyles.css
    ├── store.jsx
    ├── components/
    │   ├── Calendar/
    │   │   ├── Calendar.css
    │   │   ├── Calendar.jsx
    │   │   ├── CalendarSlicer.jsx
    │   │   └── UseCalendar.js
    │   ├── CalendarButton/
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
    │   ├── MenuButton/
    │   │   ├── MenuButton.css
    │   │   └── MenuButton.jsx
    │   └── navbar/
    │       ├── navbar.css
    │       ├── navbar.jsx
    │       └── navbarSlicer.jsx
    └── Pages/
        ├── CreateTemplate/
        ├── Dashboard/
        │   ├── Dashboard.css
        │   └── Dashboard.jsx
        ├── ExerciseLogger/
        │   ├── ExerciseLogger.css
        │   └── ExerciseLogger.jsx
        ├── ExploreWorkouts/
        │   ├── ExploreWorkouts.css
        │   └── ExploreWorkouts.jsx
        ├── FoodLog/
        │   ├── FoodLog.css
        │   └── FoodLog.jsx
        ├── Login/
        │   ├── AuthContext.jsx
        │   ├── Login.css
        │   └── Login.jsx
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
        ├── Workout/
        │   ├── Workout.css
        │   └── Workout.jsx
        └── WorkoutHistory/
            ├── WorkoutHistory.css
            └── WorkoutHistory.jsx

```

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
