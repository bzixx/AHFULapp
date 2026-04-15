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
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.setting?.theme || "Light");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState("");

  // ----- LOGIN Debug Functions ---------------------------------------------------------------------------
  useEffect(() => {
    if (isAuthenticated && user) {
      setStatusText(`Logged in as ${user.email}`);
      navigate("/Login", { replace: true });
    }
  }, [isAuthenticated, user]);

  const handle_google_success = async (response) => {
    try {
      setStatusText(`Logging in with Google...`);
      let fetchResponse = await handle_google_login(response);
      dispatch(authLogin(fetchResponse));
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
            theme={theme === "Dark" ? "filled_black" : "outline"}
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
