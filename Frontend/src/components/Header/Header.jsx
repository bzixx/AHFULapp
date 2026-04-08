import { NavLink } from "react-router-dom";
import "./Header.css";
import "../../Stylesheets/Themes/Lightmode.css";
import "../../Stylesheets/Themes/Darkmode.css";

export function Header({ onMenuToggle = null, isMenuOpen = false }) {
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
      <NavLink to="/Profile" className="profile-link">Profile</NavLink>
    </div>
  );
}