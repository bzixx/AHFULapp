import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function VerifyEmail() {
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

// ----- LOGIN Page HTML ---------------------------------------------------------------------------
  return (
    <div className="email-verification-page">
      <div className="verification-card">
        <div className="verification-title">
          <h1>'AHFUL'</h1>
          <p>(A Helpful Fitness Utilization Logger)</p>
        </div>
        <div>
          <h3>
            Hopefully your email is verified now
          </h3>
        </div>
      </div>
    </div>
  );
}
