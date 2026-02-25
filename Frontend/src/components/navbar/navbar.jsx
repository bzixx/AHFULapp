import { Link } from "react-router-dom";
import "./Navbar.css";

export function Navbar({ minHeight }) {
  return (
    <nav className="navbar">
      <Link to="/">Dashboard</Link>
      <Link to="/Login">Login</Link>
    </nav>
  );
}
