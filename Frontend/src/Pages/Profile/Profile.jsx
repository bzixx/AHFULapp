import "./Profile.css";
import "../../SiteStyles.css";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { authLogout } from "../Login/AuthSlice";
import {registerService} from "../../firebase.js";
import {handle_logout} from "../../QueryFunctions.js"
import {ProfileSettingsButton} from "../../components/ProfileSettings/ProfileSettingsButton"
import { useNavigate } from "react-router-dom";

export function Profile() {
  const [userData, setUserData] = useState({name: "", email: "", picture: ""});
  const [bio, setBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [verifyMessage] = useState("");

  const reduxUserData = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      setUserData({
        name: reduxUserData?.name,
        email: reduxUserData?.email,
        picture: reduxUserData?.picture,
      });

      //TODO: LOAD BIO FROM BACKEND OR DB INSTEAD. 
      const savedBio = localStorage.getItem("user_bio");
      if (savedBio) setBio(savedBio);
    } catch (e) {
      console.error("Error loading user data:", e);
    }
  }, []);

  const handleSaveBio = () => {
    //TODO: STORE OR ACTUALL SAVE THIS
    localStorage.setItem("user_bio", bio);
    setIsEditingBio(false);
  };

  const handleEnableNotifications = () => {
    if (reduxUserData?._id) {
      registerService(reduxUserData._id);
    } else {
      console.error("User ID not available");
    }
  };
  
  const handleVerifyEmail = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/AHFULverify/verify/email/user_id/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: reduxUserData._id,
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

  return (
  <div className="page-layout">
    <ProfileSettingsButton />
    <div className="left-column" />
    <div className="center-column">
      <div className="profile-card">
        <div className="profile-title">
          <h1>Profile</h1>
        </div>
    
        {/* Profile Picture */}
        <div className="profile-picture-section">
          <img
            className="profile-picture"
            src={userData.picture || "https://ui-avatars.com/api/?name=AH&background=c3cfe2&color=333&size=150"}
            alt={`${userData.name}'s profile`}
            referrerPolicy="no-referrer"
          />
          <h2 className="profile-name">{userData.name}</h2>
          <p className="profile-email">{userData.email}</p>
        </div>

          {/* Bio Section */}
        <div className="profile-bio-section">
          <div className="profile-bio-header">
            <h3>Bio</h3>
            <button
              className="profile-edit-btn"
              onClick={() => {
                if (isEditingBio) handleSaveBio();
                else setIsEditingBio(true);
              }}
            >
              {isEditingBio ? "Save" : "Edit"}
            </button>
          </div>
          {isEditingBio ? (
            <textarea
              className="profile-bio-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              maxLength={300}
            />
          ) : (
            <p className="profile-bio-text">
              {bio || "No bio yet. Click Edit to add one!"}
            </p>
          )}
        </div>

        {/* Notifications */}
        <div className="profile-notifications-section">
          <button
            className="profile-notifications-btn"
            onClick={handleEnableNotifications}
          >
            Enable Push Notifications
          </button>
        </div>

        {/* Terms of Service (visible from profile when logged in) */}
        <div className="profile-tos-section">
          <button
            className="profile-tos-btn"
            onClick={() => navigate("/TOS")}
          >
            Terms of Service
          </button>
        </div>

        {/* Manually verify user email*/}
        {reduxUserData?.email_verified === false && (
          <div className="profile-email-verify-section">
            <button
              className="profile-email-verify-btn"
              onClick={handleVerifyEmail}
            >
              Verify Email
            </button>
          </div>
        )}

        {/* Logout */}
        <div className="profile-logout-section">
          <button
            className="profile-logout-btn" id="logout-btn"
            onClick={() => {handle_logout(); dispatch(authLogout());}}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
    <div className="right-column" />
  </div>
  );
}
