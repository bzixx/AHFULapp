import "./ProfileSettings.css";
import { useNavigate } from "react-router-dom";

export function ProfileSettingsButton() {
  const navigate = useNavigate();

  return (
    <div className="profile-settings-wrapper">
      <button
        className="profile-settings-trigger"
        onClick={() => navigate("/Settings")}
      >
        ⚙️
      </button>
    </div>
  );
}