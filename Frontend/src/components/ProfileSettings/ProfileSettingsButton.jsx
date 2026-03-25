import "./ProfileSettings.css";
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

export function ProfileSettingsButton({ trigger = undefined, setTrigger = undefined }) {
  const [open, setOpen] = useState(Boolean(trigger));
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof trigger !== "undefined") {
      setOpen(Boolean(trigger));
    }
  }, [trigger]);

  const toggle = () => {
    if (typeof setTrigger === "function") {
      setTrigger(!trigger);
    } else {
      setOpen((s) => !s);
    }
  };

  return (
    <>
      {/* Bottom-right button */}
      <div className="profile-settings-wrapper">
        <button
          className={`profile-settings-trigger ${open ? "active" : ""}`}
          // onClick={toggle}
           onClick={() => navigate("/Settings")}
           >
          ⚙️
        </button>
      </div>

      {/* Centered popup */}
      {open && <ProfileSettingsPopup />}
    </>
  );
}