import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Navbar.css";

export function Navbar({ minHeight }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <nav className="sidebar">
      <Link to="/">Dashboard Home</Link>
      
      {!isAuthenticated ? (
        <>
        <Link to="/Login">Login</Link>
        <Link to="/TOS">Terms of Service</Link>
        </>
      ) : (
        <>
          <Link to="/WorkoutLogger">Workout Logger</Link>
          <Link to="/ExploreWorkout">Explore Workouts</Link>
          <Link to="/FoodLog">Food Log</Link>
          <Link to="/ExploreTasks">Tasks</Link>
          <Link to="/Map">Map</Link>
          <Link to="/MeasurementLogger">Measurement Logger</Link>
          <Link to="/Profile">Profile</Link>
          <Link to="/TOS">Terms of Service</Link>
          <a href="http://localhost:5000/APIDocs" target="_blank" rel="noreferrer">Documentation</a>
        </>
      )}
    </nav>
  );
}