import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";
import { useSelector, useDispatch } from "react-redux";
import { handle_google_login } from "../../QueryFunctions.js";
import { authLogin } from "../../Pages/Login/AuthSlice.jsx";
import { useNavigate } from "react-router-dom";

export function Login() {
  // ----- LOGIN STATE MANAGEMENT ---------------------------------------------------------------------------
  //Redux Site Wide Auth State
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Local Storage persistent Auth State
  const userData = localStorage.getItem("user_data");
  let parsedUser = null;
  if (!userData) {
    //If no user data exists, then we are not authenticated.  Clear any potential cookies just in case.
    localStorage.removeItem("user_data");
    //document.cookie = "user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  } else {
    //If user data exists, we will try to parse it.  If it fails to parse, we will clear it and treat as not authenticated.
    try {
      parsedUser = JSON.parse(userData);
    } catch (error) {
      localStorage.removeItem("user_data");
      console.warn(
        "AHFUL Warning: Failed to parse user_data from localStorage.  Clearing corrupted entry. ",
        error,
      );
    }
  }

  // ----- LOGIN Debug Functions ---------------------------------------------------------------------------
  const getStatusText = () => {
    if (isAuthenticated && parsedUser) {
      return `Logged in as ${parsedUser.email}`;
    }
    return "";
  };

  const handle_google_success = async (response) => {
    handle_google_login(response);
    dispatch(authLogin(localStorage.getItem("user_data")));
    await new Promise(resolve => setTimeout(resolve, 2000));
    navigate("/Login", { replace: true });
  }

  const handle_google_failure = (error) => {
    console.error(
      "AHFUL Google Button Login failed and returned Error:",
      error,
    );
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
        <div id="LoggedInStatus">{getStatusText()}</div>
      </div>
    </div>
  );
}
