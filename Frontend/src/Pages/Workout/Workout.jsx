import React, { useState, useRef, useEffect } from "react";
import "./Workout.css";
import "../../SiteStyles.css";

export function Workout() {
  /* Hook to track state of the InProgressTable on the Workout Page, Default State has exercises */
  const [exercisesInProgressTable, setExercisesInProgressTable] = useState([
    { name: "Push Ups", reps: 15, sets: 3, weight: "0", completed: false },
    {
      name: "Pull Ups",
      reps: 8,
      sets: 4,
      weight: "Full backpack",
      completed: false,
    },
    { name: "Squats", reps: 20, sets: 3, weight: "45 lbs", completed: false },
    { name: "Run", reps: "", sets: "", weight: "", completed: false },
  ]);
  /* Hook to track state of the exercises from the DB on the Workout Page */
  const [exercises, setExercises] = useState([]);
  /* Hook to track state of the exercises from the DB on the Explore Workout Page */
  const [loading, setLoading] = useState(false);
  /* Hook to track state of the error from the DB on the Workout Page */
  const [error, setError] = useState(null);
  /* Hook to track state of the timer for the workout */
  const [isRunning, setIsRunning] = useState(false);
  /* Hook to track the time elapsed during the workout */
  const [time, setTime] = useState(0);
  /*Hook to track name of the exercise being added to the workout via the dropdown */
  const [exerciseName, setExerciseName] = useState("");
  const [pendingExercises, setPendingExercises] = useState([]);
  const [open, setOpen] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  /* Functions */

  /* Exercise Functions */

  // Fetch exercises from our backend.
  // The backend registers the blueprint at /exercises (see Backend/APIRoutes/ExerciseRoutes.py).
  // The endpoint may return either a raw array (e.g. [ {name:...}, ... ])
  // or an envelope like { data: [...] } or { results: [...] } depending on the backend.
  // We try to be flexible and handle the common shapes.
  const fetch_exercises = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use a relative path so the dev server proxy (if configured) will forward to backend.
      const res = await fetch("http://localhost:5000/AHFULexercises");

      if (!res.ok) {
        // Provide a clearer error including body text when possible
        let bodyText = "";
        try {
          bodyText = await res.text();
        } catch (e) {
          /* ignore */
        }
        throw new Error(
          `Server returned ${res.status} ${res.statusText} ${bodyText}`,
        );
      }

      const data = await res.json();

      // Helpful debug output (visible in browser console) when something odd happens
      console.debug("/AHFULexercises response:", data);

      // Normalize common envelope patterns to an array
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data && Array.isArray(data.data)) {
        list = data.data;
      } else if (data && Array.isArray(data.results)) {
        list = data.results;
      } else {
        // Not an array; keep empty but log for debugging
        console.warn(
          "Unexpected /AHFULexercises response shape, expected array or {data: [...]}:",
          data,
        );
        list = [];
      }

      setExercises(list);
    } catch (err) {
      // Log the full error for debugging
      console.error("Failed to fetch exercises:", err);
      // Some Error objects (DOMExceptions) have a name and message
      const friendly =
        err && err.name ? `${err.name}: ${err.message}` : String(err);
      setError(friendly || "Unknown error");
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompleted = (index) => {
    setExercisesInProgressTable((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        completed: !updated[index].completed,
      };
      return updated;
    });
  };

  const updateField = (index, field, value) => {
    setExercisesInProgressTable((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = () => {
    console.log("Submitted workout!");
    // TODO: Update the workout by grabbing the workout id and user id
  };

  //USE EFFECT - Fecth exercises when component mounts
  useEffect(() => {
    fetch_exercises();
  }, []);

  // TOOGGLE OPEN - Toggle the dropdown for adding exercises to the workout
  const toggle_open = () => {
    setOpen((prev) => !prev);
  };

  const removeWorkout = (index) => {
    setExercisesInProgressTable((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper to extract a display name whether exercises are strings or objects
  const getExerciseName = (item) => {
    if (!item && item !== 0) return "";
    if (typeof item === "string") return item;
    if (typeof item === "object") return item.name || item.title || "";
    return String(item);
  };

  // Append selected pending exercises to the in-progress table
  const addExerciseToWorkout = (e) => {
    // allow calling from a button (no event) or a form submit event
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    if (pendingExercises.length === 0) return;

    setExercisesInProgressTable((prev) => [
      ...prev,
      ...pendingExercises.map((name) => ({
        name: getExerciseName(name),
        reps: 0,
        sets: 0,
        weight: "0",
        completed: false,
      })),
    ]);

    setPendingExercises([]);
    setExerciseName("");
  };

  // Search handler - calls the backend search endpoint and replaces `exercises` with results
  const handleSearch = async (query) => {
    const searchQuery = typeof query === "string" ? query : exerciseName;
    if (!searchQuery) {
      // If no query, re-fetch all exercises
      fetch_exercises();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:5000/AHFULexercises/search?search=${encodeURIComponent(searchQuery)}`,
      );
      if (!res.ok) {
        let bodyText = "";
        try {
          bodyText = await res.text();
        } catch (e) {}
        throw new Error(
          `Server returned ${res.status} ${res.statusText} ${bodyText}`,
        );
      }
      const data = await res.json();
      // Normalize to array
      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data && Array.isArray(data.data)) list = data.data;
      else if (data && Array.isArray(data.results)) list = data.results;
      else list = [];

      setExercises(list);
    } catch (err) {
      console.error("Search failed:", err);
      const friendly =
        err && err.name ? `${err.name}: ${err.message}` : String(err);
      setError(friendly || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  /* Timer Functions */
  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const toggleTimer = () => {
    setIsRunning((r) => !r);
  };

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="page-layout">
      <div className="left-column"></div>
      <div className="center-column">
        <div className="workout-card">
          <div className="workout-title">
            <h1>At-Home Workout</h1>
          </div>

          <div className="workout-grid">
            <div className="cell header">Exercise</div>
            <div className="cell header">Reps</div>
            <div className="cell header">Sets</div>
            <div className="cell header">Weight</div>
            <div className="cell header">Completed</div>
            <div className="cell header"></div>
            {exercisesInProgressTable.map((ex, i) => (
              <React.Fragment key={i}>
                <div className="cell">{ex.name}</div>

                <div className="cell">
                  {ex.completed ? (
                    ex.reps
                  ) : (
                    <input
                      type="number"
                      value={ex.reps}
                      onChange={(e) => updateField(i, "reps", e.target.value)}
                    />
                  )}
                </div>

                <div className="cell">
                  {ex.completed ? (
                    ex.sets
                  ) : (
                    <input
                      type="number"
                      value={ex.sets}
                      onChange={(e) => updateField(i, "sets", e.target.value)}
                    />
                  )}
                </div>

                <div className="cell">
                  {ex.completed ? (
                    ex.weight
                  ) : (
                    <input
                      type="text"
                      value={ex.weight}
                      onChange={(e) => updateField(i, "weight", e.target.value)}
                    />
                  )}
                </div>

                <div className="cell">
                  <input
                    type="checkbox"
                    checked={ex.completed}
                    onChange={() => {
                      toggleCompleted(i);
                    }}
                  />
                </div>

                <div className="cell">
                  <button
                    className="delete-button"
                    onClick={() => removeWorkout(i)}
                  >
                    🗑️
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="workout-actions">
            <div className="workout-actions-left-side"></div>

            <div className="workout-actions-right-side">
              <button className="workout-submit-button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="workout-footer">
          <div className="workout-timer-box workout-timer">
            {formatTime(time)}
          </div>

          <button
            className="workout-timer-box workout-timer-button"
            onClick={toggleTimer}
          >
            {isRunning ? "Stop Timer" : "Start Timer"}
          </button>
        </div>
      </div>
      <div className="right-column">
        <div className={`add-exercise ${open ? "open" : "closed"}`}>
          <div className="add-exercise-form">
            <div className="dropdown-wrapper">
              <input
                type="text"
                placeholder="Search exercises..."
                value={exerciseName}
                onChange={(e) => {
                  const v = e.target.value;
                  setExerciseName(v);

                  // Debounce search calls so we don't spam the backend while typing
                  if (searchTimeoutRef.current)
                    clearTimeout(searchTimeoutRef.current);
                  searchTimeoutRef.current = setTimeout(() => {
                    handleSearch(v);
                  }, 300);
                }}
                onFocus={() => {
                  // no-op: list is always visible
                }}
              />

              <div className="dropdown-instructions">
                Click an exercise to select it
              </div>

              {loading && <div className="dropdown-item">Loading...</div>}

              {!loading && exercises.length === 0 && (
                <div className="dropdown-item">No exercises found</div>
              )}

              <div className="dropdown-list">
                {!loading &&
                  exercises.map((item, i) => {
                    const name = getExerciseName(item);
                    if (
                      exerciseName &&
                      !name.toLowerCase().includes(exerciseName.toLowerCase())
                    ) {
                      return null;
                    }
                    const isSelected = pendingExercises.some(
                      (p) => getExerciseName(p) === name,
                    );
                    return (
                      <div
                        key={`item-${i}`}
                        className={`dropdown-item ${isSelected ? "selected" : ""}`}
                        onClick={() => {
                          setPendingExercises((prev) => {
                            if (prev.some((p) => getExerciseName(p) === name)) {
                              return prev.filter(
                                (p) => getExerciseName(p) !== name,
                              );
                            }
                            return [...prev, name];
                          });
                        }}
                      >
                        <span>{name}</span>
                        {isSelected && <span className="check">✓</span>}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Display the list of exercises being added */}
            {/* TODO: Show muscle group too or PR */}
            <div className="pending-list">
              {pendingExercises.map((ex, i) => {
                const name = getExerciseName(ex);
                return (
                  <div key={i} className="pending-item">
                    <span>{name}</span>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        setPendingExercises((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="add-btn-wrapper" style={{display: 'flex', gap: '8px'}}>
              <button
                className="workout-add-selected-button add-btn"
                type="button"
                onClick={() => addExerciseToWorkout()}
              >
                Add Selected Exercises
              </button>
              <button
                className="workout-open-new-button add-btn"
                type="button"
                onClick={toggle_open}
              >
                Add New Exercise
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
