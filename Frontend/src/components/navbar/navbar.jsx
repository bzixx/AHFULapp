import { Link } from "react-router-dom";
import "./Navbar.css";

export function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      {" | "}
      <Link to="/Login">Login</Link>
    </nav>
  );
}
