import { NavLink } from "react-router-dom";
import "./Navbar.css";

export function Navbar() {
  return (
    <nav className="sidebar">
      <NavLink to="/" end>Dashboard Home</NavLink>
      <NavLink to="/Login">Login</NavLink>
      <NavLink to="/WorkoutLogger">Workout Logger</NavLink>
      <NavLink to="/ExploreWorkout">Explore Workouts</NavLink>
      <NavLink to="/FoodLog">Food Log</NavLink>
      <NavLink to="/Map">Map</NavLink>
      <NavLink to="/MeasurementLogger">Measurement Logger</NavLink>
      <NavLink to="/Profile">Profile</NavLink>
      <NavLink to="/TOS">Terms of Service</NavLink>

      <a
        href="http://localhost:5000/APIDocs"
        target="_blank"
        rel="noreferrer"
      >
        Documentation
      </a>

    </nav>
  );
}