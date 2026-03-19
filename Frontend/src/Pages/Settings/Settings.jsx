import "./Settings.css";
import "../../Stylesheets/Themes/Lightmode.css";
import "../../Stylesheets/Themes/Darkmode.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownRow, ActionRow } from "./SettingsHook.jsx";

export function Settings() {
  const [activeTab, setActiveTab] = useState("personal");
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const update = (key, val) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  useEffect(() => {
    if (answers.theme === "Dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [answers.theme]);

  const saveSettings = async () => {
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(answers)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigate = async (path) => {
    await saveSettings();
    navigate(path);
  };

  return (
    <div className="settings-page">

      <div className="settings-navbar">
        <button onClick={() => handleNavigate("/")}>AHFUL</button>
        <button onClick={() => handleNavigate("/Profile")}>Profile</button>
      </div>

      <div className="settings-container">

        <div className="settings-sidebar">
          <button className={activeTab === "personal" ? "active" : ""} onClick={() => setActiveTab("personal")}>
            Personal Info
          </button>
          <button className={activeTab === "workout" ? "active" : ""} onClick={() => setActiveTab("workout")}>
            Workout
          </button>
          <button className={activeTab === "account" ? "active" : ""} onClick={() => setActiveTab("account")}>
            Account
          </button>
        </div>

        <div className="settings-content">

          {activeTab === "personal" && (
            <>
              <h2>Personal Settings</h2>

              <DropdownRow
                label="Theme"
                options={["Light", "Dark"]}
                value={answers.theme}
                onChange={(v) => update("theme", v)}
              />

              <DropdownRow
                label="Goals"
                options={["Lose Fat", "Build Muscle"]}
                value={answers.goals}
                onChange={(v) => update("goals", v)}
              />

              <DropdownRow
                label="Shame Button"
                options={["On", "Off"]}
                value={answers.shame}
                onChange={(v) => update("shame", v)}
              />

              <ActionRow label="Location" buttonText="Change" />

              <DropdownRow
                label="Units"
                options={["Imperial", "Metric"]}
                value={answers.units}
                onChange={(v) => update("units", v)}
              />

              <ActionRow label="Change Email" buttonText="Change" />
              <ActionRow label="Date of Birth" buttonText="Change" />

              <DropdownRow
                label="Gender (At Birf)"
                options={["Male", "Female", "Other"]}
                value={answers.gender}
                onChange={(v) => update("gender", v)}
              />
            </>
          )}

          {activeTab === "workout" && (
            <>
              <h2>Workout Settings</h2>

              <DropdownRow
                label="Experience"
                options={["Beginner", "Intermediate", "Advanced"]}
                value={answers.experience}
                onChange={(v) => update("experience", v)}
              />

              <DropdownRow
                label="Available Equipment"
                options={["None", "Basic", "Full Gym"]}
                value={answers.equipment}
                onChange={(v) => update("equipment", v)}
              />

              <DropdownRow
                label="Warmup Suggestion"
                options={["On", "Off"]}
                value={answers.warmup}
                onChange={(v) => update("warmup", v)}
              />

              <DropdownRow
                label="Rest Timer"
                options={["On", "Off"]}
                value={answers.rest}
                onChange={(v) => update("rest", v)}
              />
            </>
          )}

          {activeTab === "account" && (
            <>
              <h2>Account Settings</h2>

              <ActionRow label="Download Workout Data" buttonText="Download" />
              <ActionRow label="Export Progress" buttonText="Export" />
              <ActionRow label="Delete Account" buttonText="Delete" />
            </>
          )}

        </div>
      </div>
    </div>
  );
}