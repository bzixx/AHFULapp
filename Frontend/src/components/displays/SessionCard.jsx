// src/displays/SessionCard.js
// SessionCard displays all login information for the user.
// It shows User's Name, Email, Profile Picture, Login Time, and Expiry Time.
// Now uses AuthContext instead of props for session data.

import { useEffect } from "react";
import { useAuth } from "../functions/LDLAuthContext";

export default function SessionCard() {
  // Get user data and auth functions from AuthContext
  const { user , logout, verifySession } = useAuth();

  // Optional: Verify session when component mounts
  useEffect(() => {
    // You can add logic here if needed when component mounts
    // For example, refresh session data from DB
    console.log("SessionCard mounted with user:", user.display_name ?? 'not found');
  }, [user]);

  // Safety check - should never happen with ProtectedRoute, but good practice
  if (!user) {
    return (
      <div>
        <div className="header">
          <div className="logo-badge">TM</div>
          <div>
            <div className="title">Sessions</div>
            <div className="subtitle">Active user sessions and credentials</div>
          </div>
        </div>
        <div className="section" style={{ marginTop: 12 }}>
          <p className="small-muted">No active sessions found.</p>
        </div>
      </div>
    );
  }

  // Convert UNIX timestamps to readable date strings for login and expiry times
  // Use optional chaining in case fields are missing
  const loginTime = new Date(user.login_time).toLocaleDateString() ?? 'Unknown'

  // CHANGE TO SESSION EXPIRE TIME
  const expireTime = user.exp
    ? new Date(user.exp * 1000).toLocaleString()
    : user.expiry
      ? new Date(user.expiry).toLocaleString()
      : "N/A";

  const handleLogout = () => {
    logout();
    // LoginPage will automatically re-render and show CustomLDLLogin

  };

  const handleRefreshSession = async () => {
    await verifySession();
    console.log("Session refreshed");
  };

  return (
    <div>
      <div className="header">
        <div className="logo-badge">TM</div>
        <div>
          <div className="title">Sessions</div>
          <div className="subtitle">Active user sessions and credentials</div>
        </div>
      </div>

      <div className="section" style={{ marginTop: 12, position: "relative", paddingLeft: 70 }}>
        <img
          src={user.picture}
          alt="User Profile"
          width="50"
          height="50"
          style={{ position: "absolute", top: 0, left: 0, borderRadius: "50%" }}
        />

        {user.display_name ? (
          <ul className="list">
            <li className="list-item" key={user._id || user.sub}>
              <div className="kv">
                <div className="key">Session ID</div>
                <div className="value">{user._id || user.sub || "N/A"}</div>
              </div>
              <div className="kv">
                <div className="key">User</div>
                <div className="value">{user.display_name}</div>
              </div>
              <div className="kv">
                <div className="key">Email</div>
                <div className="value">{user.email}</div>
              </div>
              <div className="kv">
                <div className="key">Login Time</div>
                <div className="value">{loginTime}</div>
              </div>
              <div className="kv">
                <div className="key">Expiry Time</div>
                <div className="value">{expireTime}</div>
              </div>
            </li>
          </ul>
        ) : (
          <p className="small-muted">No active sessions found.</p>
        )}

        {/* Action buttons */}
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          <button
            onClick={handleRefreshSession}
            className="btn-secondary"
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Refresh Session
          </button>
          <button
            onClick={handleLogout}
            className="btn-danger"
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
