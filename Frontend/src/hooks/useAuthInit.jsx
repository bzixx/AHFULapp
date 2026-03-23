import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authLogin, authLogout } from '../Pages/Login/AuthSlice';
import { setSettings } from '../Pages/Settings/SettingsSlice';
import { getUserSettings } from '../QueryFunctions';

export function useAuthInit() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    async function initializeAuth() {
      if (isAuthenticated && user) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      const stored = localStorage.getItem('user_data');
      if (!stored) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      let parsedUser = null;
      try {
        parsedUser = JSON.parse(stored);
      } catch (e) {
        localStorage.removeItem('user_data');
        setLoading(false);
        setInitialized(true);
        return;
      }

      if (!parsedUser || !parsedUser.email) {
        setLoading(false);
        setInitialized(true);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/AHFULauth/whoami', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: parsedUser.email,
            last_login_expire: parsedUser.last_login_expire,
            magic_bits: parsedUser.magic_bits
          }),
          credentials: 'include'
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user_info) {
            dispatch(authLogin(data.user_info));
            
            const userId = data.user_info._id;
            if (userId) {
              try {
                const settingsData = await getUserSettings(userId);
                dispatch(setSettings({
                  theme: settingsData.displayMode === "dark" ? "Dark" : "Light",
                  units: settingsData.units ? capitalize(settingsData.units) : "Imperial",
                  goals: settingsData.goals || "Lose Fat",
                  shame: settingsData.shameLevel === "low" ? "Off" : "On",
                  equipment: settingsData.availableEquipment || "None",
                  gender: settingsData.gender || "",
                  pronouns: settingsData.pronouns || "",
                  dateOfBirth: settingsData.dateOfBirth || "",
                  locations: settingsData.locations || [],
                }));
              } catch (settingsErr) {
                console.error("Failed to load settings:", settingsErr);
              }
            }
          } else {
            localStorage.removeItem('user_data');
            dispatch(authLogout());
          }
        } else {
          localStorage.removeItem('user_data');
          dispatch(authLogout());
        }
      } catch (err) {
        console.error('Session validation failed:', err);
        localStorage.removeItem('user_data');
        dispatch(authLogout());
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }

    initializeAuth();
  }, [dispatch, isAuthenticated, user, initialized]);

  return { loading };
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}
