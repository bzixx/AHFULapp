import "./Profile.css";
import "../../siteStyles.css";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, use } from "react";
import { authLogout } from "../Login/AuthSlice";
import { setSettings, settingsInitialState } from "../Settings/SettingsSlice.jsx";
import {registerService} from "../../firebase.js";
import {handle_logout,updateUserSettings} from "../../QueryFunctions.js"
import {ProfileSettingsButton} from "../../components/ProfileSettings/ProfileSettingsButton"
import { useNavigate } from "react-router-dom";

export function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);

  const UserData = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (UserData?.user_bio) {
      setBio(UserData.user_bio);
    }
  }, [UserData]);

  const handleSaveBio = async () => {
    //TODO: STORE OR ACTUALL SAVE THIS
    await updateUserSettings(UserData._id, { user_bio: bio });
    setIsEditingBio(false);
  };

  const handleEnableNotifications = () => {
    if (UserData?._id) {
      registerService(UserData._id);
    } else {
      console.error("User ID not available");
    }
  };
  
  const handleVerifyEmail = async () => {
    try {
      const verifyUserEmailResponse = await fetch(
        "http://localhost:5000/api/AHFULverify/verify/email/user_id/",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: UserData._id,
          }),
        }
      );

      const verifyEmailData = await verifyUserEmailResponse.json(); // parse JSON
      console.log("Response JSON:", verifyEmailData);

      if (!verifyUserEmailResponse.ok) {
        alert(verifyEmailData.error || "Failed to send verification email");
        return;
      }

      alert(verifyEmailData.message);
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
            src={UserData.picture || "https://ui-avatars.com/api/?name=AH&background=c3cfe2&color=333&size=150"}
            alt={`${UserData.name}'s profile`}
            referrerPolicy="no-referrer"
          />
          <h2 className="profile-name">{UserData.name}</h2>
          <p className="profile-email">{UserData.email}</p>
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
            className="profile-page-btn"
            onClick={handleEnableNotifications}
          >
            Enable Push Notifications
          </button>
          <br />

          <button
            className="profile-page-btn"
            onClick={() => navigate("/TOS")}
          >
            Terms of Service
          </button>
        </div>


        {/* Manually verify user email*/}
        {UserData?.email_verified === false && (
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
            onClick={() => {handle_logout(); dispatch(authLogout()); dispatch(setSettings(settingsInitialState)); navigate("/");}}
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
