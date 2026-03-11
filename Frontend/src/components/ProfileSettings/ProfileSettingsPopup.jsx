import { createPortal } from "react-dom";
import { useState } from "react";
import "./ProfileSettings.css";

export function ProfileSettingsPopup({ onClose }) {

  const [answers, setAnswers] = useState({
    theme: null,
    shame: null
  });

  const handleSelect = (question, value) => {
    setAnswers(prev => ({
      ...prev,
      [question]: value
    }));
  };

  return createPortal(
    <div className="settings-popup-overlay">
      <div className="settings-popup-container">

        <div className="settings-popup-header">
          Settings
        </div>

        <div className="settings-list">

          <div className="settings-question">

            <div className="settings-header">
              Theme
            </div>

            <div className="option-list">

              <div
                className={`option-row ${answers.theme === "light" ? "selected" : ""}`}
                onClick={() => handleSelect("theme", "light")}
              >
                <div className="bubble" />
                <span>Light Mode</span>
              </div>

              <div
                className={`option-row ${answers.theme === "dark" ? "selected" : ""}`}
                onClick={() => handleSelect("theme", "dark")}
              >
                <div className="bubble" />
                <span>Dark Mode</span>
              </div>

            </div>

          </div>

          <div className="settings-question">

            <div className="settings-header">
              AI Shame Level
            </div>

            <div className="option-list">

              <div
                className={`option-row ${answers.shame === "low" ? "selected" : ""}`}
                onClick={() => handleSelect("shame", "low")}
              >
                <div className="bubble" />
                <span>Encouraging</span>
              </div>

              <div
                className={`option-row ${answers.shame === "medium" ? "selected" : ""}`}
                onClick={() => handleSelect("shame", "medium")}
              >
                <div className="bubble" />
                <span>Honest</span>
              </div>

              <div
                className={`option-row ${answers.shame === "high" ? "selected" : ""}`}
                onClick={() => handleSelect("shame", "high")}
              >
                <div className="bubble" />
                <span>Brutal</span>
              </div>

            </div>

          </div>

        </div>

        <button className="settings-close-button" onClick={onClose}>
          Close
        </button>

      </div>
    </div>,
    document.body
  );
}