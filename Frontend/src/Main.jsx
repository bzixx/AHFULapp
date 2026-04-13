import React from 'react'
import ReactDOM from 'react-dom/client'
import AHFULApp from './AHFULApp.jsx'
import './SiteStyles.css'
import { StoreProvider, persistor } from './Store.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter as Router } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Loading } from './components/Loading/Loading.jsx';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authLogin, authLogout } from './Pages/Login/AuthSlice';
import { setSettings } from './Pages/Settings/SettingsSlice';
import { getUserSettings , whoami} from './QueryFunctions';


function AHFULApp_localStorageChecked() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userSettings = useSelector((state) => state.setting);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const AHFUL_session_validation = async () => {
      //Initalize App check for Existing Session
      const localStorageUserData = localStorage.getItem('user_data');

      //Check if we already have an authenticated session in Redux.  If so, we can skip validating the session as Redux is only set after this.
      if (isAuthenticated && user) {
        //Redux state is "Trusted", no need to validate session again.
        setLoading(false);
        return;
      }

      //Check for Local Storage Data.  If we don't have any, we can skip validating the session as we know we don't have one.
      if (!localStorageUserData) {
        //No Local storage data, user will need to Sign In.  No need to validate session as we know we don't have one.
        setLoading(false);
        return;
      }else{
        //User says they have Creds. Need to validate session.
        try {
          //Parse Local Storage
          const parsedUserData = JSON.parse(localStorageUserData);

          //If we got here, we have valid JSON in localStorage.  We will attempt to validate the session with the server.
          let fetchResponse = await whoami(parsedUserData)

          if (fetchResponse) {
            dispatch(authLogin(fetchResponse.user_info));
            console.log("Session Validated.  User Info:", fetchResponse.user_info);
            
            const userId = fetchResponse.user_info._id;
            console.log("Attempting to load settings for user ID:", userId);
            if (userId) {
              try {
                //Fetch user settings and load them into Redux If user ID does not have settings QueryFunction Handels. 
                const settingsData = await getUserSettings(userId);
                console.log("Settings Data Fetched:", settingsData);
                dispatch(setSettings({
                  theme: settingsData.displayMode ,
                  units: settingsData.units ,
                  goals: settingsData.goals ,
                  shame: settingsData.shameLevel ,
                  equipment: settingsData.availableEquipment,
                  gender: settingsData.gender,
                  pronouns: settingsData.pronouns,
                  dateOfBirth: settingsData.dateOfBirth,
                  locations: settingsData.locations,
                  tutorialComplete: settingsData.tutorialComplete,
                }));
                
              } catch (settingsErr) {
                console.error("Failed to load settings:", settingsErr);
              }
            }
      
          } else {
            localStorage.removeItem('user_data');
            dispatch(authLogout());
          }
        } catch (error) {
          console.error("Something went wrong reading session.  Removing Stored Data.  Error Was:", error);
          localStorage.removeItem('user_data');
        }finally{
          setLoading(false);
        }
      }
    }

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

ReactDOM.createRoot(document.getElementById('root')).render(
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
)
