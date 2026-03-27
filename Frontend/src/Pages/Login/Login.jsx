import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";
import { useSelector, useDispatch } from "react-redux";
import { handle_google_login } from "../../QueryFunctions.js";
import { authLogin } from "../../Pages/Login/AuthSlice.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function Login() {
  // ----- LOGIN STATE MANAGEMENT ---------------------------------------------------------------------------
  //Redux Site Wide Auth State
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState("");
  const [parsedUser, setParsedUser] = useState(null);

  
  useEffect(() => {
    const userData = localStorage.getItem("user_data");

    if (!userData) {
      //If no user data exists, then we are not authenticated.  Clear any potential cookies just in case.
      localStorage.removeItem("user_data");
      //document.cookie = "user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setParsedUser(null);
      return;
    }

    try {
      setParsedUser(JSON.parse(userData));
    } catch {
      localStorage.removeItem("user_data");
      console.warn(
        "AHFUL Warning: Failed to parse user_data from localStorage.  Clearing corrupted entry. ",
        error,
      );
    }
   }, []);

  // ----- LOGIN Debug Functions ---------------------------------------------------------------------------
  useEffect(() => {
    if (isAuthenticated && parsedUser) {
      setStatusText(`Logged in as ${parsedUser.email}`);
      navigate("/Login", { replace: true });
    }
  }, [isAuthenticated, parsedUser]);

  const handle_google_success = async (response) => {
    // Clear any old auth junk before attempting new login
    localStorage.removeItem("user_data");
    dispatch(authLogin(null));
    try {
      setStatusText("Logging in...");
      await handle_google_login(response);
      dispatch(authLogin(localStorage.getItem("user_data")));

      const storedUser = localStorage.getItem("user_data");
      if (storedUser) {
        setParsedUser(JSON.parse(storedUser));
      }
    }
    catch (error) {
      console.error("Google login error:", error);
      setStatusText(error.message || "Login failed. Please try again.");
      // Make sure state stays "not authenticated"
      localStorage.removeItem("user_data");
      dispatch(authLogin(null));
    }
  }

  const handle_google_failure = (error) => {
    console.error("Google Login failed:", error);
    setStatusText("Google login failed. Please try again.");
  };

// ----- LOGIN Page HTML ---------------------------------------------------------------------------
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-title">
          <h1>'AHFUL'</h1>
          <p>(A Helpful Fitness Utilization Logger)</p>
        </div>
        <div>
          <h3>
            'AHFUL' app is your one-stop shop for everything you need in A Helpful Fitness Utilization Logger.
          </h3>

          <ul>
            <li>Record workouts</li>
            <li>Save templates</li>
            <li>Schedule future workouts on a calendar</li>
            <li>Track food nutrition, etc.</li>
          </ul>

          <h3>
            To use 'AHFUL' app, you'll need to sign in with your Google
            account below.
          </h3>
        </div>
        <div className="login-button">
          <GoogleLogin
            size="large"
            width="200"
            text="signin_with"
            theme="filled_black"
            shape="pill"
            onSuccess={handle_google_success}
            onError={handle_google_failure}
          />
        </div>
        <div id="LoggedInStatus">{statusText}</div>
      </div>
    </div>
  );
}
