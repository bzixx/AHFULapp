import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";
import { useSelector, useDispatch } from "react-redux";
import { handle_google_login } from "../../QueryFunctions.js";
import { authLogin } from "../../Pages/Login/AuthSlice.jsx";
import { useNavigate } from "react-router-dom";

export function Login() {
  // ----- LOGIN STATE MANAGEMENT ---------------------------------------------------------------------------
  //Redux Site Wide Auth State
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ----- LOGIN Debug Functions ---------------------------------------------------------------------------
  const getStatusText = () => {
    if (isAuthenticated && user) {
      return `Logged in as ${user.email}`;
    }
    return "";
  };

  const handle_google_success = async (response) => {
    let fetchResponse = await handle_google_login(response);
    console.log("AHFUL Google Button Login successful. Server Response:", fetchResponse);
    dispatch(authLogin(fetchResponse));
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
