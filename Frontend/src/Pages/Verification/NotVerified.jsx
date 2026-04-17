import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams} from "react-router-dom";
import { useState, useEffect } from "react";

export function NotVerified() {
  // ----- Verification STATE MANAGEMENT ---------------------------------------------------------------------------
  //Redux Site Wide Auth State
  const theme = useSelector((state) => state.setting?.theme || "Light");

  const [statusText, setStatusText] = useState("");
  const user = useSelector((state) => state.auth.user);

  const handleVerifyEmail = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/AHFULverify/verify/email/user_id/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user._id,
          }),
        }
      );

      //const data = await res.json();
      const data = await res.json(); // parse JSON
      console.log("Response JSON:", data);

      if (!res.ok) {
        alert(data.error || "Failed to send verification email");
        return;
      }

      alert(data.message);
    } catch (err) {
      console.error("Verify email failed:", err);
      alert("Network error sending verification email");
    }
  };

// ----- Verification Page HTML ---------------------------------------------------------------------------
  return (
    <div className="not-verified-page">
        <h2>Your email is not verified</h2>   
        <h2>Please check your email for a verification email, and follow the link</h2>   
        <h2>You can leave this page</h2>

        {/* Manually verify user email*/}
          <div className="profile-email-verify-section">
            <button
              className="profile-email-verify-btn"
              onClick={handleVerifyEmail}
            >
              Verify Email
            </button>
          </div>
    </div>
  );
}
