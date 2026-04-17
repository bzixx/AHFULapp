import React from 'react'
import ReactDOM from 'react-dom/client'
import AHFULApp from './AHFULApp.jsx'
import './siteStyles.css'
import './Stylesheets/Themes/Lightmode.css'
import './Stylesheets/Themes/Darkmode.css'
import { StoreProvider, persistor } from './store.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Loading } from "./components/Loading/Loading.jsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authLogin, authLogout } from "./Pages/Login/AuthSlice";
import { setSettings } from "./Pages/Settings/SettingsSlice";
import { getUserSettings, whoami } from "./QueryFunctions";

function AHFULApp_localStorageChecked() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userSettings = useSelector((state) => state.setting);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const AHFUL_session_validation = async () => {
      try {
        setLoading(true);
        //Network Fetch to Backend wchich will send cookie
        let fetchResponse = await whoami();

        //Backend will send back userSettings ID cookie if user was valid.

        //Load in data from userSettings in network call

        //If we got here, we have valid JSON in localStorage.  We will attempt to validate the session with the server.

        if (fetchResponse) {
          dispatch(authLogin(fetchResponse.user_info));
          console.log(
            "Session Validated.  User Info:",
            fetchResponse.user_info,
          );

          const userId = fetchResponse.user_info._id;
          console.log("Attempting to load settings for user ID:", userId);
          if (userId) {
            try {
              //Fetch user settings and load them into Redux If user ID does not have settings QueryFunction Handels.
              const settingsData = await getUserSettings(userId);
              console.log("Settings Data Fetched:", settingsData);
              dispatch(setSettings({}));
            } catch (settingsErr) {
              console.error("Failed to load settings:", settingsErr);
            }
          }
        } else {
          dispatch(authLogout());
        }
      } catch (error) {
        console.error(
          "Something went wrong reading session.  Removing Stored Data.  Error Was:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    AHFUL_session_validation();
  }, []);

  useEffect(() => {
    if (userSettings.theme === "Dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [userSettings.theme]);

  return loading ? <Loading /> : <AHFULApp />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StoreProvider>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <Router>
            <AHFULApp_localStorageChecked />
          </Router>
        </GoogleOAuthProvider>
      </PersistGate>
    </StoreProvider>
  </React.StrictMode>,
);
