import React, { useEffect, useState } from "react";
import "./ExploreWorkouts.css";
import "../../SiteStyles.css";

export function ExploreWorkouts() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch exercises from our backend.
  // The backend registers the blueprint at /exercises (see Backend/APIRoutes/ExerciseRoutes.py).
  // The endpoint may return either a raw array (e.g. [ {name:...}, ... ])
  // or an envelope like { data: [...] } or { results: [...] } depending on the backend.
  // We try to be flexible and handle the common shapes.
  const fetchExercises = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use a relative path so the dev server proxy (if configured) will forward to backend.
      const res = await fetch("http://localhost:5000/AHFULworkout");

      //If Response is not OK, try to extract more info from the body and Throw
      if (!res.ok) {
        // Provide a clearer error including body text when possible
        let bodyText = "";
        try {
          bodyText = await res.text();
        } catch (e) {
          /* ignore */
        }
        throw new Error(`Server returned ${res.status} ${res.statusText} ${bodyText}`);
      }

      //
      const data = await res.json();
      setExercises(data);
    } catch (err) {

      // Log the full error for debugging
      console.error("Failed to fetch exercises:", err);
      // Some Error objects (DOMExceptions) have a name and message
      const friendly = err && err.name ? `${err.name}: ${err.message}` : String(err);
      setError(friendly || "Unknown error");
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div className="explore-root">
      <header className="explore-header">
        <h1>Explore Exercises</h1>
        <div>
          <button onClick={fetchExercises} disabled={loading} className="refresh-btn">
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {error && <div className="explore-error">Error: {error}</div>}

      {!error && (
        <div className="exercise-list">
          {loading && exercises.length === 0 ? (
            <div className="explore-loading">Loading exercises…</div>
          ) : exercises.length === 0 ? (
            <div className="explore-empty">No exercises found.</div>
          ) : (
            exercises.map((ex, idx) => {
              // Use a stable key where possible; fall back to index when no id/name available.
              const key = ex.id || ex._id || ex.name || `exercise-${idx}`;
              return (
                <div key={key} className="exercise-item">
                  <div className="exercise-main">
                    <div className="exercise-name">{ex.title || "Untitled"}</div>
                    <div className="exercise-meta">
                      {ex.startTime && <span>Start: {ex.startTime}</span>}
                      {ex.endTime && <span> • End: {ex.endTime}</span>}
                      {ex.gymId && <span> • Gym: {ex.gymId}</span>}
                    </div>
                  </div>
                  {ex.instructions && <div className="exercise-instructions">{ex.instructions}</div>}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
