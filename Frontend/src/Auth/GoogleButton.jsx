import { useGoogleLogin } from "@react-oauth/google";
import { useSelector, useDispatch } from "react-redux";
import { handle_google_login, getUserSettings } from "../QueryFunctions.js";
import { authLogin } from "./AuthSlice.jsx";
import { setSettings } from '../Auth/SettingsSlice.jsx';  
import googleIcon from "../../images/Login/GoogleIcons/web_dark_rd_na@2x.png";
import googleIconNotScrolled from "../../images/Login/GoogleIcons/web_dark_rd_SI@4x.png";
import "./Auth.css";

export function GoogleButton({ onSuccess, onError, isScrolled }) {
  const dispatch = useDispatch();
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

  return (
    <button onClick={googleLogin} className={`google-login-button ${isScrolled ? 'scrolled' : ''}`}>
      <img src={isScrolled ? googleIcon : googleIconNotScrolled} alt="Sign in with Google" />
    </button>
  );
}