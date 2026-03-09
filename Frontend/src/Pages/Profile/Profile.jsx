import React, { useState, useEffect } from "react";
import "./Profile.css";
import "../../SiteStyles.css";
export function Profile() {
    const [userData, setUserData] = useState({name: "", email: "", picture: ""});
    const [bio, setBio] = useState("");
    const [isEditingBio, setIsEditingBio] = useState(false);

    useEffect(() => {
      try {
        const stored = JSON.parse(localStorage.getItem("user_data"));
        if (stored) {
          setUserData({
            name: stored.name || "User",
            email: stored.email || "",
            picture: stored.picture || "",
          });
        }
        const savedBio = localStorage.getItem("user_bio");
        if (savedBio) setBio(savedBio);
      } catch (e) {
        console.error("Error loading user data:", e);
      }
    }, []);

    const handleSaveBio = () => {
      localStorage.setItem("user_bio", bio);
      setIsEditingBio(false);
    };

    return (
    <div className="page-layout">
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
              src={userData.picture || "https://ui-avatars.com/api/?name=User&background=c3cfe2&color=333&size=150"}
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
              onClick={() => {}}
            >
              Enable Push Notifications
            </button>
          </div>
        </div>
      </div>
      <div className="right-column" />
    </div>
  );
}


