import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";
import { useSelector, useDispatch } from "react-redux";
import { handle_google_login, getUserSettings } from "../../QueryFunctions.js";
import { authLogin } from "../../Pages/Login/AuthSlice.jsx";
import { useState, useEffect } from "react";
import { onLoginCache } from "../../components/Cache/OnLoginCache/OnLoginCache.jsx";
import { setSettings } from '../../Pages/Settings/SettingsSlice.jsx';

export function Login() {
  const dispatch = useDispatch();
  //Redux Site Wide Auth State
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.setting?.theme || "Light");
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.email_verified === false) {
        setStatusText(`Logged in as ${user.email}, email not verified`);
        navigate("/NotVerified", { replace: true });
      }
      else {
        setStatusText(`Logged in as ${user.email}`);
        navigate("/Login", { replace: true });
        onLoginCache();
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handle_google_success = async (response) => {
    try {
      setStatusText(`Logging in with Google...`);
      let fetchResponse = await handle_google_login(response);

      if (!fetchResponse || fetchResponse?.ok === false) {
        console.error("Google login failed:", fetchResponse?.error || fetchResponse);
        setStatusText(
          fetchResponse?.error || `Google login failed (${fetchResponse?.status || "unknown"})`,
        );
        return;
      }

      let userSettingsResponse = await getUserSettings();

      if (!userSettingsResponse || userSettingsResponse?.ok === false) {
        console.error("Failed to get user settings:", userSettingsResponse?.error || userSettingsResponse);
        setStatusText(
          userSettingsResponse?.error || `Failed to fetch user settings`,
        );
        return;
      }

      dispatch(authLogin(fetchResponse.user_info));
      dispatch(setSettings(userSettingsResponse));

    } catch (error) {
      console.error("Google login error:", error);
      setStatusText(error.message || "Login failed. Please try again.");
    }

    //Another Edit
  };

  const handle_google_failure = (error) => {
    console.error("Google Login failed:", error);
    setStatusText("Google login failed. Please try again.");
  };

  // ----- LOGIN Page HTML ---------------------------------------------------------------------------
  return (
    <div className="login-page">
      <div className="solo-page-container">
        <div className="login-title">
          <div className="logo-row">
            <img src="../../../images/Flex.ico" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
            <div>
              <h1>AHFUL App</h1>
              A Helpful Fitness Utilization Logger App
            </div>
          </div>
        </div>
        <div>
          <div className="heading">Welcome back</div>
          <div className="subhead">
            Track workouts, hit your goals, and stay consistent — everything in
            one place.
          </div>
          <div className="subhead">
            In order to Register or Login, you must have a Google account. AHFUL utilizes Google for secure near-passwordless authentication.
          </div>

          <ul>
            <li>Record workouts</li>
            <li>Workout History</li>
            <li>Workout Templates</li>
            <li>Calendar & Workout Scheduling</li>
            <li>Nutrition Tracking</li>
            <li>Find Tracking</li>
            <li>AI Coaching</li>
          </ul>

        </div>
        <div className="login-button">
          <GoogleLogin
            size="large"
            width="200"
            text="signin_with"
            theme={theme === "dark" ? "filled_black" : "outline"}
            shape="pill"
            onSuccess={handle_google_success}
            onError={handle_google_failure}
          />
        </div>
        <div className="footer-note">
          By signing in, you explicitly agree to our Terms of Service.
        </div>

        <div id="LoggedInStatus">{statusText}</div>
      </div>
    </div>
  );
}
