import { Link } from "react-router-dom";
import "./Navbar.css";

export function Navbar({ minHeight }) {
  return (
    <nav className = "navbar" style={{ minHeight }}>
      <Link to="/">Home</Link>
      {" | "}
      <Link to="/Login">Login</Link>
    </nav>
  );
}
