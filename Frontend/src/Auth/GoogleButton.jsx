import { useGoogleLogin } from "@react-oauth/google";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { handle_google_login, getUserSettings } from "../QueryFunctions.js";
import { authLogin } from "./AuthSlice.jsx";
import { setSettings } from '../Auth/SettingsSlice.jsx';  
import googleIconDay from "../../images/Login/GoogleIcons/web_light_rd_na@2x.png";
import googleIconNotScrolledDay from "../../images/Login/GoogleIcons/web_light_rd_SI@4x.png";
import googleIconNight from "../../images/Login/GoogleIcons/web_dark_rd_na@2x.png";
import googleIconNotScrolledNight from "../../images/Login/GoogleIcons/web_dark_rd_SI@4x.png";
import "./Auth.css";

export function GoogleButton({ onSuccess, onError, isScrolled }) {
  const dispatch = useDispatch();
  const [isNightMode, setIsNightMode] = useState(false);

  useEffect(() => {
    const checkTimeOfDay = () => {
      const hour = new Date().getHours();
      const isNight = hour >= 16 || hour < 5;
      setIsNightMode(isNight);
    };
    checkTimeOfDay();
    const interval = setInterval(checkTimeOfDay, 60000);
    return () => clearInterval(interval);
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        let fetchResponse = await handle_google_login(response);

        if (!fetchResponse || fetchResponse?.ok === false) {
          console.error("Google login failed:", fetchResponse?.error || fetchResponse);
          onError?.(fetchResponse?.error || "Google login failed");
          return;
        }

        let userSettingsResponse = await getUserSettings();

        if (!userSettingsResponse || userSettingsResponse?.ok === false) {
          console.error("Failed to get user settings:", userSettingsResponse?.error || userSettingsResponse);
          onError?.(userSettingsResponse?.error || "Failed to fetch user settings");
          return;
        }

        dispatch(authLogin(fetchResponse.user_info));
        dispatch(setSettings(userSettingsResponse));
        onSuccess?.();

      } catch (error) {
        console.error("Google login error:", error);
        onError?.(error.message || "Login failed. Please try again.");
      }
    },
    onError: (error) => {
      console.error("Google Login failed:", error);
      onError?.(error);
    }
  });

  const getScrolledImage = () => {
    return isNightMode ? googleIconNight : googleIconDay;
  };

  const getUnscrolledImage = () => {
    return isNightMode ? googleIconNotScrolledNight : googleIconNotScrolledDay;
  };

  return (
    <>
      <button className={`google-login-button ${isScrolled ? 'hidden' : ''}`} onClick={() => googleLogin()}>
        <img src={getUnscrolledImage()} alt="Google Login" />
      </button>
      <button className={`google-login-button-scrolled ${isScrolled ? 'visible' : ''}`} onClick={() => googleLogin()}>
        <img src={getScrolledImage()} alt="Google Login" />
      </button>
    </>
  );
}