import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { WorkoutLogger } from "./Pages/WorkoutLogger/WorkoutLogger.jsx";
import { ExploreWorkouts } from "./Pages/ExploreWorkouts/ExploreWorkouts.jsx";
import { FoodLog } from "./Pages/FoodLog/FoodLog.jsx";
import { Dashboard } from "./Pages/Dashboard/Dashboard.jsx";
import { Login } from "./Pages/Login/Login.jsx";
import { Map } from "./Pages/Map/Map.jsx";
import { MeasurementLogger } from "./Pages/MeasurementLogger/MeasurementLogger.jsx";
import { Profile } from "./Pages/Profile/Profile.jsx";
import { TOS } from "./Pages/TOS/TOS.jsx";
import { Layout } from "./layout.jsx"
import { AuthRouteCheck } from "./AuthRouteCheck.jsx";
import { Settings } from "./Pages/Settings/Settings.jsx";
import "./SiteStyles.css";


function AHFULApp() {

  // Example: detect page changes and refresh a value when the route changes.
  // This component is rendered inside a <Router> (see `main.jsx`), so useLocation works here.
  const location = useLocation();
  const [pageChangeCount, setPageChangeCount] = useState(0);

  useEffect(() => {
    // increment a counter every time the pathname changes — replace with your refresh logic
    setPageChangeCount((c) => c + 1);
    // console.log("route changed to", location.pathname);
  }, [location.pathname]);




  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/WorkoutLogger" element={
            <AuthRouteCheck>
              <WorkoutLogger/>
            </AuthRouteCheck>}/>
          <Route path="/ExploreWorkout" element={
            <AuthRouteCheck>
              <ExploreWorkouts/>
            </AuthRouteCheck>
            }/>
          <Route path="/FoodLog" element={
            <AuthRouteCheck>
              <FoodLog/>
            </AuthRouteCheck>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Map" element={
            <AuthRouteCheck>
              <Map/>
            </AuthRouteCheck>}/>
          <Route path="/MeasurementLogger" element={
            <AuthRouteCheck>
              <MeasurementLogger/>
            </AuthRouteCheck>}/>
          <Route path="/Profile" element={
            <AuthRouteCheck>
              <Profile/>
            </AuthRouteCheck>}/>
          <Route path="/TOS" element={
            <AuthRouteCheck>
              <TOS/>
            </AuthRouteCheck>}/>
        </Route>
        <Route path="Settings" element={
          <Settings/>
        }/>
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default AHFULApp
