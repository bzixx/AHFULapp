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
  const [showNewExerciseModal, setShowNewExerciseModal] = useState(false);

  // Wireframe option lists for dropdowns (replace with fetch later)
  const MUSCLES = [
    "Chest",
    "Back",
    "Shoulders",
    "Biceps",
    "Triceps",
    "Quadriceps",
    "Hamstrings",
    "Calves",
    "Abs",
  ];

  const BODY_PARTS = ["Upper Body", "Lower Body", "Full Body", "Core"];

  // Fallback equipment list (used while fetching or if fetch fails) - normalized to {value,label}
  const EQUIPMENT_FALLBACK = [
    { value: "None", label: "None" },
    { value: "Dumbbell", label: "Dumbbell" },
    { value: "Barbell", label: "Barbell" },
    { value: "Kettlebell", label: "Kettlebell" },
    { value: "Machine", label: "Machine" },
    { value: "Resistance Band", label: "Resistance Band" },
  ];

  const [equipmentOptions, setEquipmentOptions] = useState(EQUIPMENT_FALLBACK);
  const [equipmentError, setEquipmentError] = useState(null);

  useEffect(() => {
    loadEquipment();
  }, []);

  const [newExercise, setNewExercise] = useState({
    name: "",
    targetMuscles: [],
    bodyParts: [],
    equipment: [],
    instructions: "",
  });

  const resetNewExercise = () =>
    setNewExercise({
      name: "",
      targetMuscles: [],
      bodyParts: [],
      equipment: [],
      instructions: "",
    });

  const openNewExerciseModal = () => {
    resetNewExercise();
    setShowNewExerciseModal(true);
  };

  async function loadEquipment() {
    setEquipmentError(null);
    try {
      const res = await fetch("https://www.exercisedb.dev/api/v1/equipments", {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          // Some servers will require this header; adding it as requested.
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(
          `Equipment API returned ${res.status} ${res.statusText}`,
        );
      }

      const data = await res.json();
      // data may be an array, or an envelope like { data: [...] }
      let arr = data;
      if (data && Array.isArray(data.data)) arr = data.data;

      console.log("Fetched equipment data:", arr);

      // Normalize to [{value,label}, ...]
      if (arr) {
        const normalized = arr.map((item, idx) => {
          if (item && typeof item === "object") {
            const value =
              item.id ?? item._id ?? item.value ?? item.name ?? String(idx);
            const label =
              item.name ?? item.title ?? item.equipment ?? String(value);
            return { value: String(value), label: String(label) };
          }
          // fallback for unexpected types
          const v = String(item);
          return { value: v, label: v };
        });
        setEquipmentOptions(normalized);
      }
    } catch (err) {
      // Common failure mode is a CORS block (TypeError) or network error.
      console.error("Failed to load equipment options:", err);
      setEquipmentError(
        err && err.message
          ? `Could not load equipment list: ${err.message}`
          : "Could not load equipment list",
      );
      // keep fallback list in place
    }
  }

  const closeNewExerciseModal = () => {
    setShowNewExerciseModal(false);
  };

  const handleNewExerciseSave = (e) => {
    e.preventDefault();
    if (!newExercise.name.trim()) {
      alert("Please enter a name for the exercise");
      return;
    }

    // For now, append to exercises list (could POST to backend later)
    setExercises((prev) => [...prev, { ...newExercise }]);
    closeNewExerciseModal();
  };

  const handleMultiSelectChange = (e, field) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setNewExercise((prev) => ({ ...prev, [field]: values }));
  };
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
      const res = await fetch("http://localhost:5000/AHFULExercises");

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

  /////////////////////////////////////////////////////////////////////////////////////////
  /* Initial Page Load */
  /////////////////////////////////////////////////////////////////////////////////////////

  // Test id: user_id: 699d0093795741a59fe13616
  const userId = "699d0093795741a59fe13616";
  const [workout, setWorkout] = useState("");
  const [workoutId, setWorkoutId] = useState("");
  const [workoutTitle, setWorkoutTitle] = useState("");

  useEffect(() => {
    async function getWorkout() {
      try {
        const res = await fetch(`http://localhost:5000/AHFULworkout/${userId}`);
        const data = await res.json();

        console.log(data);

        // Only set workoutId if data is a non-empty array
        if (Array.isArray(data) && data.length > 0) {
          setWorkout(data[0]);
          setWorkoutId(data[0]._id);
          setWorkoutTitle(data[0]["title"]);
        } else {
          console.warn("Workout data is empty or invalid:", data);
        }
      } catch (err) {
        console.error("Error fetching workout:", err);
      }
    }

    getWorkout();
  }, []);

  useEffect(() => {
    if (!workoutId) return; // prevents running on initial render

    async function getPersonalEx() {
      try {
        console.log("Fetching personal exercises for workout:", workoutId);

        const res = await fetch(
          `http://localhost:5000/AHFULpersonalEx/workout/${workoutId}`,
        );
        const data = await res.json();

        setExercisesInProgressTable(data);
      } catch (err) {
        console.error("Error fetching personal exercises:", err);
      }
    }

    getPersonalEx();
  }, [workoutId]); // <-- runs only when workoutId changes

  useEffect(() => {
    console.log("PersonalEx state updated:", exercisesInProgressTable);
  }, [exercisesInProgressTable]);

  function unixToDate(unix) {
    return new Date(unix * 1000).toLocaleDateString("en-US");
  }

  return (
    <div className="page-layout">
      <div className="left-column">
        <div className="template-container">
          <form
            onSubmit={addExerciseToWorkout}
            className="apply-template"
          ></form>
        </div>
      </div>

      <div className="center-column">
        <div className="workout-card">
          <div className="workout-title">
            <h1>{workoutTitle}</h1>
            {workout && <h2>{unixToDate(workout.startTime)}</h2>}
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
                <div className="cell">{ex.exerciseId}</div>

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
        <div className="add-exercise">
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
              <div className="dropdown">
                {loading && <div className="dropdown-item">Loading...</div>}

                {!loading && exercises.length === 0 && (
                  <div className="dropdown-item">No exercises found</div>
                )}

                <div className="dropdown-item">
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
                              if (
                                prev.some((p) => getExerciseName(p) === name)
                              ) {
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

            <div
              className="add-btn-wrapper"
              style={{ display: "flex", gap: "8px" }}
            >
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
                onClick={openNewExerciseModal}
              >
                Add New Exercise
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* New Exercise Modal */}
      {showNewExerciseModal && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={closeNewExerciseModal}
        >
          <form
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleNewExerciseSave}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "480px",
              maxWidth: "95%",
            }}
          >
            <h3>Add New Exercise</h3>

            <label style={{ display: "block", marginTop: 8 }}>Name</label>
            <input
              type="text"
              value={newExercise.name}
              onChange={(e) =>
                setNewExercise((p) => ({ ...p, name: e.target.value }))
              }
              style={{ width: "100%" }}
            />

            <label style={{ display: "block", marginTop: 8 }}>
              Target Muscles
            </label>
            <select
              multiple
              value={newExercise.targetMuscles}
              onChange={(e) => handleMultiSelectChange(e, "targetMuscles")}
              style={{ width: "100%" }}
            >
              {MUSCLES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <label style={{ display: "block", marginTop: 8 }}>Body Parts</label>
            <select
              multiple
              value={newExercise.bodyParts}
              onChange={(e) => handleMultiSelectChange(e, "bodyParts")}
              style={{ width: "100%" }}
            >
              {BODY_PARTS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <label style={{ display: "block", marginTop: 8 }}>Equipment</label>
            {equipmentError && (
              <div style={{ color: "red", marginBottom: 6 }}>
                {equipmentError}
              </div>
            )}
            <select
              multiple
              value={newExercise.equipment}
              onChange={(e) => handleMultiSelectChange(e, "equipment")}
              style={{ width: "100%" }}
            >
              {equipmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <label style={{ display: "block", marginTop: 8 }}>
              Instructions
            </label>
            <textarea
              value={newExercise.instructions}
              onChange={(e) =>
                setNewExercise((p) => ({ ...p, instructions: e.target.value }))
              }
              style={{ width: "100%" }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 12,
              }}
            >
              <button type="button" onClick={closeNewExerciseModal}>
                Cancel
              </button>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
