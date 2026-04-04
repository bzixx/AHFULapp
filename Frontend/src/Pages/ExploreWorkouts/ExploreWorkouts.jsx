import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./ExploreWorkouts.css";
import "../../SiteStyles.css";
import { Calendar } from "../../components/Calendar/Calendar";
import { HeatMap } from "../../components/HeatMap/HeatMap";
import { WorkoutChart } from "../../components/WorkoutChart/WorkoutChart";

/**
 * ExploreWorkouts - Workout exploration and history page
 * 
 * Features:
 * - View all workouts or just my workouts (toggle)
 * - Interactive workout history chart with week selection
 * - Heat map showing workout frequency
 * - Calendar integration
 * 
 * Layout:
 * - Left column: List of workouts/exercises
 * - Right column: WorkoutChart and HeatMap widgets
 * - Bottom: Calendar component
 */
export function ExploreWorkouts() {
  // ─── State ────────────────────────────────────────────────────────────────────
  const user = useSelector((state) => state.auth.user);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(true);

  const getUserId = () => {
    if (user?._id) return user._id;
    try {
      const stored = JSON.parse(localStorage.getItem("user_data"));
      return stored?._id || null;
    } catch { return null; }
  };
  const userId = getUserId();

  // ─── Fetch Workouts from Backend ─────────────────────────────────────────────
  const fetchExercises = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "https://www.ahful.app/api/AHFULworkout";
      if (!showAll && userId) {
        url = `https://www.ahful.app/api/AHFULworkout/${userId}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        let bodyText = "";
        try {
          bodyText = await res.text();
        } catch (e) {
          // Ignore text extraction errors
        }
        throw new Error(`Server returned ${res.status} ${res.statusText} ${bodyText}`);
      }

      const data = await res.json();
      setWorkouts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch workouts:", err);
      const friendly = err && err.name ? `${err.name}: ${err.message}` : String(err);
      setError(friendly || "Unknown error");
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  // ─── Load Workouts on Mount ───────────────────────────────────────────────────
  useEffect(() => {
    fetchExercises();
  }, [showAll, userId]);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="explore-root">
      {/* Page Header with Title, Toggle, and Refresh Button */}
      <header className="explore-header">
        <h1>Explore Workouts</h1>
        <div className="header-controls">
          <div className="toggle-container">
            <button 
              className={`toggle-btn ${showAll ? 'active' : ''}`}
              onClick={() => setShowAll(true)}
            >
              All Workouts
            </button>
            <button 
              className={`toggle-btn ${!showAll ? 'active' : ''}`}
              onClick={() => setShowAll(false)}
              disabled={!userId}
            >
              My Workouts
            </button>
          </div>
          <button onClick={fetchExercises} disabled={loading} className="refresh-btn">
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="explore-content">
        {/* Left Column: Workout List */}
        <div className="explore-left">
          {/* Error Message */}
          {error && <div className="explore-error">Error: {error}</div>}

          {!error && (
            <div className="exercise-list">
              {/* Loading State */}
              {loading && workouts.length === 0 ? (
                <div className="explore-loading">Loading workouts…</div>
              ) : workouts.length === 0 ? (
                /* Empty State - no workouts yet */
                <div className="explore-empty">
                  {showAll ? "No workouts found." : "No workouts found. Start a workout to see it here!"}
                </div>
              ) : (
                /* Workout List */
                workouts.map((workout, idx) => {
                  // Generate unique key for each workout item
                  const key = workout.id || workout._id || workout.title || `workout-${idx}`;
                  return (
                    <div key={key} className="exercise-item">
                      <div className="exercise-main">
                        {/* Workout Title */}
                        <div className="exercise-name">
                          {workout.title || "Untitled Workout"}
                        </div>
                        {/* Workout Metadata (start/end times, gym) */}
                        <div className="exercise-meta">
                          {workout.startTime && (
                            <span>Start: {new Date(workout.startTime * 1000).toLocaleDateString()}</span>
                          )}
                          {workout.endTime && (
                            <span> • End: {new Date(workout.endTime * 1000).toLocaleDateString()}</span>
                          )}
                          {workout.gymId && <span> • Gym ID: {workout.gymId.slice(0, 8)}...</span>}
                        </div>
                      </div>
                      {/* Optional Instructions */}
                      {workout.instructions && (
                        <div className="exercise-instructions">{workout.instructions}</div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Right Column: Charts and Visualizations */}
        <div className="explore-right">
          {/* Interactive Workout History Chart */}
          {/* Allows users to select different week ranges (4, 6, 8, 12 weeks) */}
          <WorkoutChart defaultWeeks={6} />
          {/* Heat Map showing workout frequency over time */}

          <HeatMap />
        </div>
      </div>

      {/* Calendar Component */}
      <Calendar />
    </div>
  );
}
