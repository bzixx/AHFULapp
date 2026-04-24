import {  useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { WorkoutLogger } from "./Pages/WorkoutLogger/WorkoutLogger.jsx";
import { ExploreWorkouts } from "./ExploreWorkouts/ExploreWorkouts.jsx";
import { FoodLog } from "./Food/FoodLog.jsx";
import { Dashboard } from "./Pages/Dashboard/Dashboard.jsx";
import { Login } from "./Pages/Login/Login.jsx";
import { VerifyEmail } from "./Pages/Verification/VerifyEmail.jsx";
import { NotVerified } from "./Pages/Verification/NotVerified.jsx";
import { Map } from "./Pages/Map/Map.jsx";
import { AIChat } from "./AIChat/AIChat.jsx";
import { MeasurementLogger } from "./Pages/MeasurementLogger/MeasurementLogger.jsx";
import { Profile } from "./Pages/Profile/Profile.jsx";
import { TOS } from "./Pages/TOS/TOS.jsx";
import { Layout } from "./Layout.jsx"
import { AuthRouteCheck } from "./AuthRouteCheck.jsx";
import { Settings } from "./Pages/Settings/Settings.jsx";
import { ExploreTasks } from "./Tasks/ExploreTasks.jsx";
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
      const path = window.location.pathname || '/';

      // If whoami fails to return (network or missing cookies),
      // don't force a redirect when the user is already on the public
      // root path ('/'). But if they're trying to visit any other
      // route, send them to the Login page.
      if (!whomstResponse) {
        if (path === '/' || path === '/TOS') {
          // allow browsing the public dashboard/root without forcing login
          return;
        }

        navigate('/Login');
        return;
      }

      if (whomstResponse.ok){
        dispatch(authLogin(whomstResponse.data.user_info));

        const userSettingsResponse = await getUserSettings();
        dispatch(setSettings(userSettingsResponse));
      }else{
        if (path === '/' || path === '/TOS') {
          // allow browsing the public dashboard/root without forcing login
          return;
        }
        navigate('/Login');
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
              <WorkoutLogger/>} />
          <Route path="/ExploreWorkout" element={
              <ExploreWorkouts/>}/>
          <Route path="/FoodLog" element={
              <FoodLog/>}/>
          <Route path="/EmailVerification" element={
              <VerifyEmail/>}/>
          <Route path="/NotVerified" element={
              <NotVerified/>}/>
          <Route path="/AIChat" element={
              <AIChat/>}/>
          <Route path="/Map" element={
              <Map/>}/>
          <Route path="/MeasurementLogger" element={
              <MeasurementLogger/>}/>
          <Route path="/Profile" element={
              <Profile/>}/>
          <Route path="/ExploreTasks" element={
              <ExploreTasks/>}/>
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
