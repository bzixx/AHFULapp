  import { GoogleLogin } from "@react-oauth/google";
import { useSelector } from "react-redux";
import { handle_google_login, getUserSettings } from "../QueryFunctions.js";
import { authLogin } from "./AuthSlice.jsx";
import { useDispatch } from "react-redux";
import { setSettings } from '../Auth/SettingsSlice.jsx';

export function GoogleButton({ onSuccess, onError }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.setting?.theme || "Light");

  const handle_google_success = async (response) => {
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
  };

  const handle_google_failure = (error) => {
    console.error("Google Login failed:", error);
    onError?.(error);
  };

  return (
    <GoogleLogin
      onSuccess={handle_google_success}
      onError={handle_google_failure}
    />
  );
}