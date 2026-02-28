import { Link } from "react-router-dom";
import "./Navbar.css";

export function Navbar({ minHeight }) {
  return (
    <nav className="sidebar">
      <Link to="/">Home</Link>
      <Link to="/Login">Login</Link>
      <Link to="/Workout">Workout</Link>
      <Link to="/ExerciseLogger">Exercise Logger</Link>
      <Link to="/ExploreWorkout">Explore Workouts</Link>
      <Link to="/FoodLog">Food Log</Link>
      <Link to="/Map">Map</Link>
      <Link to="/MeasurementLogger">Measurement Logger</Link>
      <Link to="/Profile">Profile</Link>
      <Link to="/TOS">Terms of Service</Link>
      <Link to="/WorkoutHistory">Workout History</Link>
      <a href="http://localhost:5000/APIDocs" target="_blank" rel="noreferrer">Documentation</a>
    </nav>
  );
}
