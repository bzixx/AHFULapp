import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function VerifyPhoneNumber() {
  // ----- Verification STATE MANAGEMENT ---------------------------------------------------------------------------
  //Redux Site Wide Auth State
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.setting?.theme || "light");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [statusText, setStatusText] = useState("");

  // ----- Verification Debug Functions ---------------------------------------------------------------------------
  useEffect(() => {
    if (isAuthenticated && user) {
      setStatusText(`Logged in as ${user.email}`);
      navigate("/Login", { replace: true });
    }
  }, [isAuthenticated, user]);

// ----- Verification Page HTML ---------------------------------------------------------------------------
  return (
    <div className="phone-verification-page">
      <div className="verification-card">
        <div className="verification-title">
          <h1>Phone Number Verification</h1>
        </div>
        <div>
          <h3>
            Your phone number was successfully verified! You can leave this page or proceed to login
          </h3>
          <a href="/Login" className="primary-cta">Log In</a>
        </div>
      </div>
    </div>
  );
}
