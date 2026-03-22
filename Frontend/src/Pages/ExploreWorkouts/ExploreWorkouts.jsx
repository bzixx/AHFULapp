import React, { useEffect, useState } from "react";
import "./ExploreWorkouts.css";
import "../../SiteStyles.css";
import { Calendar } from "../../components/Calendar/Calendar";
import { HeatMap } from "../../Components/HeatMap/HeatMap";
import { WorkoutChart } from "../../Components/WorkoutChart/WorkoutChart";

/**
 * ExploreWorkouts - Workout exploration and history page
 * 
 * Features:
 * - View all workouts (displayed as exercise items)
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
  // All workouts fetched from the backend
  const [workouts, setWorkouts] = useState([]);
  // Loading state for API calls
  const [loading, setLoading] = useState(false);
  // Error state for displaying errors to user
  const [error, setError] = useState(null);

  // ─── Fetch Workouts from Backend ─────────────────────────────────────────────
  // Fetches all workouts for the current user (filtered by userId on backend)
  const fetchExercises = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/AHFULworkout");

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
      // Set workouts - backend should return array or wrap in object
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
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="explore-root">
      {/* Page Header with Title and Refresh Button */}
      <header className="explore-header">
        <h1>Explore Workouts</h1>
        <div>
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
                <div className="explore-empty">No workouts found. Start a workout to see it here!</div>
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
