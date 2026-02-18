import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Workout } from "./Pages/Workout/Workout.jsx";
import { ExerciseLogger } from "./Pages/ExerciseLogger/ExerciseLogger.jsx";
import { ExploreWorkouts } from "./Pages/ExploreWorkouts/ExploreWorkouts.jsx";
import { FoodLog } from "./Pages/FoodLog/FoodLog.jsx";
import { Home } from "./Pages/Home/Home.jsx";
import { Login } from "./Pages/Login/Login.jsx";
import { Map } from "./Pages/map/map.jsx";
import { MeasurementLogger } from "./Pages/MeasurementLogger/MeasurementLogger.jsx";
import { Profile } from "./Pages/Profile/Profile.jsx";
import { TOS } from "./Pages/TOS/TOS.jsx";
import { WorkoutHistory } from "./Pages/WorkoutHistory/WorkoutHistory.jsx";
import { Layout } from "./Layout.jsx"
import "./siteStyles.css";

function AHFULApp() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route element={<Layout/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/Workout" element={<Workout/>}/>
            <Route path="/ExerciseLogger" element={<ExerciseLogger/>}/>
            <Route path="/ExploreWorkout" element={<ExploreWorkouts/>}/>
            <Route path="/FoodLog" element={<FoodLog/>}/>
            <Route path="/Login" element={<Login/>}/>
            <Route path="/Map" element={<Map/>}/>
            <Route path="/MeasurementLogger" element={<MeasurementLogger/>}/>
            <Route path="/Profile" element={<Profile/>}/>
            <Route path="/TOS" element={<TOS/>}/>
            <Route path="/WorkoutHistory" element={<WorkoutHistory/>}/>
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default AHFULApp
