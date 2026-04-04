import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { WorkoutLogger } from "./Pages/WorkoutLogger/WorkoutLogger.jsx";
import { ExploreWorkouts } from "./Pages/ExploreWorkouts/ExploreWorkouts.jsx";
import { FoodLog } from "./Pages/FoodLog/FoodLog.jsx";
import { Dashboard } from "./Pages/Dashboard/Dashboard.jsx";
import { Login } from "./Pages/Login/Login.jsx";
import { Map } from "./Pages/Map/Map.jsx";
import { AIChat } from "./Pages/AIChat/AIChat.jsx";
import { MeasurementLogger } from "./Pages/MeasurementLogger/MeasurementLogger.jsx";
import { Profile } from "./Pages/Profile/Profile.jsx";
import { TOS } from "./Pages/TOS/TOS.jsx";
import { Layout } from "./layout.jsx"
import { AuthRouteCheck } from "./AuthRouteCheck.jsx";
import { Settings } from "./Pages/Settings/Settings.jsx";
import { ExploreTasks } from "./Pages/ExploreTasks/ExploreTasks.jsx";
import { useTutorial } from "./hooks/useTutorial.js";
import { TutorialOverlay } from "./components/Tutorial/TutorialOverlay.jsx";
import "./SiteStyles.css";


function AHFULApp() { 
    // Example: detect page changes and refresh a value when the route changes.
  // This component is rendered inside a <Router> (see `main.jsx`), so useLocation works here.
  const location = useLocation();
  const [pageChangeCount, setPageChangeCount] = useState(0);
  const { 
    isActive: tutorialActive, 
    currentStep, 
    totalSteps, 
    currentStepData,
    skipTutorial, 
    nextStep,
    completeTutorial 
  } = useTutorial();

  useEffect(() => {
        // increment a counter every time the pathname changes — used for debugging route changes
    setPageChangeCount((c) => c + 1);
    // console.log("route changed to", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/TOS" element={<TOS/>}/>
          <Route path="/WorkoutLogger" element={
            <AuthRouteCheck>
              <WorkoutLogger/>
            </AuthRouteCheck>} />
          <Route path="/ExploreWorkout" element={
            <AuthRouteCheck>
              <ExploreWorkouts/>
            </AuthRouteCheck>
            }/>
          <Route path="/FoodLog" element={
            <AuthRouteCheck>
              <FoodLog/>
            </AuthRouteCheck>}/>
          <Route path="/AIChat" element={
            <AuthRouteCheck>
              <AIChat/>
            </AuthRouteCheck>}/>
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
          <Route path="/ExploreTasks" element={
            <AuthRouteCheck>
              <ExploreTasks/>
            </AuthRouteCheck>}/>
        </Route>
        <Route path="Settings" element={<Settings/>} />
      </Routes>
      {tutorialActive && currentStepData && (
        <TutorialOverlay
          step={currentStep}
          totalSteps={totalSteps}
          title={currentStepData.title}
          message={currentStepData.message}
          highlightSelector={currentStepData.highlightSelector}
          onNext={nextStep}
          onSkip={skipTutorial}
          onComplete={completeTutorial}
        />
      )}
    </>
  );
}

export default AHFULApp
