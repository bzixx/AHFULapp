## AHFUL Application -- Frontend Technical Documentation

This directory holds all information required for the Frontend to render and load for the user.  
Key components:
All Navigation Pages for the user
Custom Auth Context component for persistent authentication

### Frontend Directory Structure

```
    frontend/
    ├── images/
    │   └── Flex.ico
    ├── src/
    │   ├── components/
    │   │   ├── Calendar/
    │   │   │   ├── Calendar.css
    │   │   │   └── Calendar.jsx
    │   │   ├── HeatMap/
    │   │   │   ├── HeatMap.css
    │   │   │   └── HeatMap.jsx
    │   │   ├── Navbar/
    │   │   │   ├── Navbar.css
    │   │   │   ├── Navbar.jsx
    │   │   │   └── NavbarSlider.jsx
    │   │   └── pages/   
    │   ├── pages/
    │   │   ├── CreateTemplate/
    │   │   │   ├── CreateTemplate.css
    │   │   │   └── CreateTemplate.jsx
    │   │   ├── ExerciseLogger/
    │   │   │   ├── ExerciseLogger.css
    │   │   │   └── ExerciseLogger.jsx
    │   │   ├── ExploreWorkouts/
    │   │   │   ├── ExploreWorkouts.css
    │   │   │   └── ExploreWorkouts.jsx
    │   │   ├── FoodLog/
    │   │   │   ├── FoodLog.css
    │   │   │   └── FoodLog.jsx
    │   │   ├── Home/
    │   │   │   ├── Home.css
    │   │   │   └── Home.jsx
    │   │   ├── Login/
    │   │   │   ├── authSlicer.jsx
    │   │   │   ├── Login.css
    │   │   │   └── Login.jsx
    │   │   ├── Map/
    │   │   │   ├── Map.css
    │   │   │   └── Map.jsx
    │   │   ├── MeasurementLogger/
    │   │   │   ├── MeasurementLogger.css
    │   │   │   └── MeasurementLogger.jsx
    │   │   ├── Profile/
    │   │   │   ├── Profile.css
    │   │   │   └── Profile.jsx
    │   │   ├── TOS/
    │   │   │   ├── TOS.css
    │   │   │   └── TOS.jsx
    │   │   ├── WorkoutHistory/
    │   │   │   ├── WorkoutHistory.css
    │   │   │   └── WorkoutHistory.jsx
    │   │   ├── AwsCredentialsSelectorPage.jsx    
    │   │   ├── LoadingPage.jsx                
    │   │   ├── LoginPageOld.jsx               
    │   │   └── Navigation.jsx                    
    │   ├── AHFULApp.jsx
    │   ├── Layout.jsx
    │   ├── Main.jsx
    │   ├── siteStyles.css
    │   └── Store.jsx
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── biome.json
    ├── README.md
    └── vite.config.js


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
