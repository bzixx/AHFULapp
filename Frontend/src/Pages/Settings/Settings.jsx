import "./Settings.css";
import "../../Stylesheets/Themes/Lightmode.css";
import "../../Stylesheets/Themes/Darkmode.css";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DropdownRow, ActionRow } from "./SettingsHook.jsx";
import { updateSetting, setSettings } from "./SettingsSlice.jsx";
import { getUserSettings, updateUserSettings } from "../../QueryFunctions";

export function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const answers = useSelector((state) => state.setting);
  const user = useSelector((state) => state.auth.user);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
      if (!user || !user._id) {
        console.log("No user or user._id found");
        return;
      }
      
      try {
        const data = await getUserSettings(user._id);
        
        dispatch(setSettings({
          theme: data.displayMode === "dark" ? "Dark" : "Light",
          units: data.units ? capitalize(data.units) : "Imperial",
          goals: data.goals || "Lose Fat",
          shame: data.shameLevel === "low" ? "Off" : data.shameLevel === "medium" ? "On" : data.shameLevel === "high" ? "On" : "On",
          equipment: data.availableEquipment || "None",
          gender: data.gender || "",
          pronouns: data.pronouns || "",
          dateOfBirth: data.dateOfBirth || "",
          locations: data.locations || [],
        }));
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };

    fetchSettings();
  }, [dispatch, user]);

  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const handleSave = () => {
    console.log("handleSave clicked, user:", user);
    
    if (!user || !user._id) {
      console.log("No user ID available");
      return;
    }
    
    setSaving(true);
    setSaveSuccess(false);
    
    const payload = {
      displayMode: answers.theme === "Dark" ? "dark" : "light",
      units: answers.units.toLowerCase(),
      goals: answers.goals.toLowerCase().replace(" ", "_"),
      shameLevel: answers.shame === "Off" ? "low" : answers.shame === "On" ? "medium" : "low",
      availableEquipment: answers.equipment.toLowerCase().replace(" ", "_"),
      gender: answers.gender || "",
      pronouns: answers.pronouns || "",
      dateOfBirth: answers.dateOfBirth || "",
      locations: answers.locations || [],
    };

    console.log("Saving payload:", payload);

    updateUserSettings(user._id, payload)
      .then(() => {
        console.log("Settings saved successfully");
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to save settings:", err);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleNavigate = (path) => {
    handleSave();
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
                options={["Lose Fat", "Build Muscle", "Maintain"]}
                value={answers.goals}
                onChange={(v) => update("goals", v)}
              />

              <DropdownRow
                label="Shame Level"
                options={["Off", "On"]}
                value={answers.shame}
                onChange={(v) => update("shame", v)}
              />

              <DropdownRow
                label="Units"
                options={["Imperial", "Metric"]}
                value={answers.units}
                onChange={(v) => update("units", v)}
              />

              <div className="setting-row">
                <span className="setting-label">Gender</span>
                <div className="setting-control">
                  <input
                    type="text"
                    value={answers.gender || ""}
                    onChange={(e) => update("gender", e.target.value)}
                    placeholder="Enter gender"
                    className="setting-input"
                  />
                </div>
              </div>

              <div className="setting-row">
                <span className="setting-label">Pronouns</span>
                <div className="setting-control">
                  <input
                    type="text"
                    value={answers.pronouns || ""}
                    onChange={(e) => update("pronouns", e.target.value)}
                    placeholder="e.g. they/them"
                    className="setting-input"
                  />
                </div>
              </div>

              <div className="setting-row">
                <span className="setting-label">Date of Birth</span>
                <div className="setting-control">
                  <input
                    type="date"
                    value={answers.dateOfBirth || ""}
                    onChange={(e) => update("dateOfBirth", e.target.value)}
                    className="setting-input"
                  />
                </div>
              </div>
            </>
          )}

          {answers.activeTab === "workout" && (
            <>
              <h2>Workout Settings</h2>

              <DropdownRow
                label="Available Equipment"
                options={["None", "Basic", "Full Gym"]}
                value={answers.equipment}
                onChange={(v) => update("equipment", v)}
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

          <div className="settings-save-section">
            <button 
              type="button"
              className="settings-save-button" 
              onClick={handleSave}
              disabled={saving}
              style={{ display: 'block', position: 'relative', zIndex: 9999 }}
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
            {saveSuccess && <span className="save-success">Settings saved!</span>}
          </div>

        </div>
      </div>
    </div>
  );
}
