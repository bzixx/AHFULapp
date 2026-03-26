import { NavLink } from "react-router-dom";
import "./Header.css";
import "../../Stylesheets/Themes/Lightmode.css";
import "../../Stylesheets/Themes/Darkmode.css";

export function Header() {
  return (
    <div className="header">
      <NavLink to="/" className="logo">AHFUL</NavLink>
      <NavLink to="/Profile" className="profile-link">Profile</NavLink>
    </div>
  );
}