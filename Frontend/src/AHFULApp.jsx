import {  useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { WorkoutLogger } from "./Pages/WorkoutLogger/WorkoutLogger.jsx";
import { ExploreWorkouts } from "./Pages/ExploreWorkouts/ExploreWorkouts.jsx";
import { FoodLog } from "./Pages/FoodLog/FoodLog.jsx";
import { Dashboard } from "./Pages/Dashboard/Dashboard.jsx";
import { Login } from "./Pages/Login/Login.jsx";
import { VerifyEmail } from "./Pages/Verification/VerifyEmail.jsx";
import { Map } from "./Pages/Map/Map.jsx";
import { AIChat } from "./Pages/AIChat/AIChat.jsx";
import { MeasurementLogger } from "./Pages/MeasurementLogger/MeasurementLogger.jsx";
import { Profile } from "./Pages/Profile/Profile.jsx";
import { TOS } from "./Pages/TOS/TOS.jsx";
import { Layout } from "./Layout.jsx"
import { AuthRouteCheck } from "./AuthRouteCheck.jsx";
import { Settings } from "./Pages/Settings/Settings.jsx";
import { ExploreTasks } from "./Pages/ExploreTasks/ExploreTasks.jsx";
import { Test } from "./Pages/Test/Test.jsx";
import { useTutorial } from "./hooks/useTutorial.js";
import { TutorialOverlay } from "./components/Tutorial/TutorialOverlay.jsx";
import "./siteStyles.css";
import "./Stylesheets/Themes/Lightmode.css";
import "./Stylesheets/Themes/Darkmode.css";
import { whoami, getUserSettings } from "./QueryFunctions.js";
import { setSettings } from './Pages/Settings/SettingsSlice.jsx';
import { authLogin } from "./Pages/Login/AuthSlice.jsx";


function AHFULApp() {
  const theme = useSelector((state) => state.setting.theme);
  const userData = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isActive: tutorialActive,
    currentStep,
    totalSteps,
    currentStepData,
    skipTutorial,
    nextStep,
    completeTutorial
  } = useTutorial();

  // Apply theme globally - runs on all pages
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);  

  // Apply WhoAmI Check globally - runs on all pages
  useEffect(() => {
    const checkCookies = async () => {
      // We only want to run this check once on app load, not on every route change.
      const whomstResponse = await whoami();
      if (whomstResponse.ok){
        dispatch(authLogin(whomstResponse.user_info));

        const userSettingsResponse = await getUserSettings();
        dispatch(setSettings(userSettingsResponse));
      }
    }

    checkCookies();
  }, []);  


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
          <Route path="/EmailVerification" element={
              <VerifyEmail/>}/>
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
          <Route path="/Test" element={<Test/>}/>
        </Route>
        <Route path="Settings" element={<Settings/>} />
      </Routes>
``
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
