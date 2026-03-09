import React, { useEffect, useState } from "react";
import "./ExploreWorkouts.css";
import "../../SiteStyles.css";

export function ExploreWorkouts() {



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
                    <div className="exercise-name">{ex.name || "Untitled"}</div>
                    <div className="exercise-meta">
                      {ex.muscle_group && <span>{ex.muscle_group}</span>}
                      {ex.difficulty && <span> • {ex.difficulty}</span>}
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
