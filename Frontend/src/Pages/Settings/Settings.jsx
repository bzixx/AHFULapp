import "./Settings.css";
import "../../Stylesheets/Themes/Lightmode.css";
import "../../Stylesheets/Themes/Darkmode.css";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DropdownRow, ActionRow } from "./SettingsHook.jsx";
import { updateSetting, setSettings } from "./SettingsSlice.jsx";

export function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const answers = useSelector((state) => state.setting);

  const update = (key, val) => {
    dispatch(updateSetting({ key, value: val }));
  };

  useEffect(() => {
    if (answers.theme === "Dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [answers.theme]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) return;

        const res = await fetch(`/api/settings/${user_id}`);
        if (!res.ok) return;

        const data = await res.json();

        dispatch(setSettings({
          theme: data.displayMode === "dark" ? "Dark" : "Light",
          units: data.units ? capitalize(data.units) : "Imperial",
        }));

      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };

    fetchSettings();
  }, [dispatch]);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const saveSettings = async () => {
    console.log("Save Called")
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) return;

      const { activeTab, ...settingsToSave } = answers;

      const payload = {
        user_id,
        displayMode: settingsToSave.theme === "Dark" ? "dark" : "light",
        units: settingsToSave.units.toLowerCase(),
      };

      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Settings saved:", payload);
    } catch (err) {
      console.error("Failed to save settings:", err);
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
          <button
            className={answers.activeTab === "personal" ? "active" : ""}
            onClick={() => update("activeTab", "personal")}
          >
            Personal Info
          </button>

          <button
            className={answers.activeTab === "workout" ? "active" : ""}
            onClick={() => update("activeTab", "workout")}
          >
            Workout
          </button>

          <button
            className={answers.activeTab === "account" ? "active" : ""}
            onClick={() => update("activeTab", "account")}
          >
            Account
          </button>
        </div>

        <div className="settings-content">

          {answers.activeTab === "personal" && (
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
                label="Gender (At Birth)"
                options={["Male", "Female", "Other"]}
                value={answers.gender}
                onChange={(v) => update("gender", v)}
              />
            </>
          )}

          {answers.activeTab === "workout" && (
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

          {answers.activeTab === "account" && (
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