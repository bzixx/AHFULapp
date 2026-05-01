import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./siteStyles.css";

export function Navbar({ minHeight, isOpen = false, onNavClick = null }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const handleNavClick = () => {
    if (onNavClick) {
      onNavClick();
    }
  };

  return (
    <nav className={`sidebar ${isOpen ? "open" : "closed"}`} style={{ minHeight }}>
      <NavLink
        to="/Dashboard"
        className={({ isActive }) => (isActive ? "active" : "")}
        onClick={handleNavClick}
      >
        Dashboard Home
      </NavLink>

      {(!isAuthenticated || !user.email_verified) ? (
        <>
          <NavLink
            to="/Login"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleNavClick}
          >
            Login
          </NavLink>

          <NavLink
            to="/TOS"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleNavClick}
          >
            Terms of Service
          </NavLink>
        </>
      ):(
        <>
          <NavLink
            to="/WorkoutLogger"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleNavClick}
          >
            Workout Logger
          </NavLink>

          <NavLink
            to="/AIChat"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleNavClick}
          >
            AI Chat
          </NavLink>

          <NavLink
            to="/ExploreWorkout"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleNavClick}
          >
            Explore Workouts
          </NavLink>
          <NavLink
            to="/FoodLog"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleNavClick}
          >
            Food Log
          </NavLink>

          <NavLink
            to="/ExploreTasks"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleNavClick}
          >
            Explore Tasks
          </NavLink>

          <NavLink
            to="/Favorites"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleNavClick}
          >
            ⭐ My Favorites
          </NavLink>

          <NavLink
            to="/Map"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleNavClick}
          >
            Gym's & Map
          </NavLink>

          <NavLink
            to="/MeasurementLogger"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={handleNavClick}
          >
            Measurement Logger
          </NavLink>

          <a
            href="http://localhost:5000/api/APIDocs"
            target="_blank"
            rel="noreferrer"
            onClick={handleNavClick}
          >
            Documentation
          </a>
        </>
        )}

      { (user?.roles?.includes("Admin") && user?.email_verified == true) && (<a
        href="http://localhost:5000/api/APIDocs"
        target="_blank"
        rel="noreferrer"
        onClick={handleNavClick}>
        Documentation
      </a>)}
    </nav>
  );
}
