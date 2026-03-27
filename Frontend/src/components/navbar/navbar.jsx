import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navbar.css";

export function Navbar({ minHeight }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <nav className="sidebar" style={{ minHeight }}>
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        Dashboard Home
      </NavLink>

      {!isAuthenticated ? (
        <>
          <NavLink
            to="/Login"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Login
          </NavLink>

          <NavLink
            to="/TOS"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Terms of Service
          </NavLink>
        </>
      ):(
        <>
          <NavLink
            to="/WorkoutLogger"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Workout Logger
          </NavLink>

          <NavLink
            to="/ExploreWorkout"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Explore Workouts
          </NavLink>

          <NavLink
            to="/FoodLog"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Food Log
          </NavLink>

          <NavLink
            to="/ExploreTasks"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Tasks
          </NavLink>

          <NavLink
            to="/Map"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Map
          </NavLink>

          <NavLink
            to="/MeasurementLogger"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Measurement Logger
          </NavLink>

          <NavLink
            to="/Profile"
            className={({ isActive }) =>
              isActive || location.pathname.startsWith("/Settings")
                ? "active"
                : ""
            }
          >
            Profile
          </NavLink> 
          <a
            href="http://localhost:5000/APIDocs"
            target="_blank"
            rel="noreferrer"
          >
            Documentation
          </a>
        </>
        )}
    </nav>
  );
}