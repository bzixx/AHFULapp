import { useState, useEffect } from "react";
import { ProfileSettingsPopup } from "./ProfileSettingsPopup.jsx";
import "./ProfileSettings.css";

export function ProfileSettingsButton({ trigger = undefined, setTrigger = undefined }) {
  const [open, setOpen] = useState(Boolean(trigger));

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
          onClick={toggle}
        >
          ⚙️
        </button>
      </div>

      {/* Centered popup */}
      {open && <ProfileSettingsPopup />}
    </>
  );
}