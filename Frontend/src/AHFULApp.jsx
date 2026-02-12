import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CreateTemplate } from "./components/pages/CreateTemplate/CreateTemplate.jsx";
import { ExerciseLogger } from "./components/pages/ExerciseLogger/ExerciseLogger.jsx";
import { ExploreWorkouts } from "./components/pages/ExploreWorkouts/ExploreWorkouts.jsx";
import { FoodLog } from "./components/pages/FoodLog/FoodLog.jsx";
import { Home } from "./components/pages/Home/Home.jsx";
import { Login } from "./components/pages/Login/Login.jsx";
import { Map } from "./components/pages/Map/Map.jsx";
import { MeasurementLogger } from "./components/pages/MeasurementLogger/MeasurementLogger.jsx";
import { Profile } from "./components/pages/Profile/Profile.jsx";
import { TOS } from "./components/pages/TOS/TOS.jsx";
import { WorkoutHistory } from "./components/pages/WorkoutHistory/WorkoutHistory.jsx";
import { Layout } from "./layout.jsx"
import "./siteStyles.css";

function AHFULApp() {
  return (
  <Router>
    <Routes>
      <Route element={<Layout/>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/CreateTemplate" element={<CreateTemplate/>}/>
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
  )
}

export default AHFULApp