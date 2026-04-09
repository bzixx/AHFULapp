import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateSetting } from "../../Pages/Settings/SettingsSlice";
import { updateUserSettings } from "../../QueryFunctions";
import "./Header.css";
import "../../Stylesheets/Themes/Lightmode.css";
import "../../Stylesheets/Themes/Darkmode.css";

export function Header({ onMenuToggle = null, isMenuOpen = false }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.setting?.theme || "Light");
  const user = useSelector((state) => state.auth.user);

  const handleThemeToggle = () => {
    const newTheme = theme === "Light" ? "Dark" : "Light";
    dispatch(updateSetting({ key: "theme", value: newTheme }));
    
    if (user && user._id) {
      updateUserSettings(user._id, { 
        displayMode: newTheme === "Dark" ? "dark" : "light" 
      }).catch(err => console.error("Failed to save theme:", err));
    }
  };

  return (
    <div className="header">
      <button
        className={`hamburger-menu ${isMenuOpen ? "active" : ""}`}
        onClick={onMenuToggle}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <NavLink to="/" className="logo">AHFUL</NavLink>
      <div className="header-right">
        <button
          className="theme-toggle"
          onClick={handleThemeToggle}
          aria-label="Toggle theme"
          title={`Switch to ${theme === "Light" ? "Dark" : "Light"} mode`}
        >
          {theme === "Light" ? "🌙" : "☀️"}
        </button>
        <NavLink to="/Profile" className="profile-link">Profile</NavLink>
      </div>
    </div>
  );
}
