import React, { useState, useRef, useEffect } from "react";
import "./WorkoutLogger.css";
import "../../SiteStyles.css";
import {
  getDefaultNewExercise,
  formatTime as formatTimeFn,
  loadEquipment as loadEquipmentFn,
  loadTargetMuscles,
  fetchExercisesFromBackend,
  searchExercises,
  fetchWorkout,
  fetchPersonalExercises,
} from "../../queryFunctions";

export function WorkoutLogger() {
  const [personalExNames, setPersonalExNames] = useState({});
  /* Hook to track state of the InProgressTable on the Workout Page */
  const [exercisesInProgressTable, setExercisesInProgressTable] = useState([]);
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

  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [equipmentError, setEquipmentError] = useState(null);

  const [muscleOptions, setMuscleOptions] = useState([]);
  const [muscleError, setMuscleError] = useState(null);


  const [newExercise, setNewExercise] = useState(getDefaultNewExercise());

  const resetNewExercise = () => setNewExercise(getDefaultNewExercise());

  const openNewExerciseModal = () => {
    resetNewExercise();
    setShowNewExerciseModal(true);
  };

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

  // useEffect 1: cleanup debounced search timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  // useEffect 2: load equipment options once on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await loadEquipmentFn();
      if (!mounted) return;
      if (res && res.data) setEquipmentOptions(res.data);
      if (res && res.error) setEquipmentError(res.error);
    })();

        (async () => {
      const res = await loadTargetMuscles();
      if (!mounted) return;
      if (res && res.data) setMuscleOptions(res.data);
      if (res && res.error) setMuscleError(res.error);
    })();

    return () => {
      mounted = false;
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
      const list = await fetchExercisesFromBackend();
      setExercises(list);
    } catch (err) {
      console.error("Failed to fetch exercises:", err);
      const friendly = err && err.name ? `${err.name}: ${err.message}` : String(err);
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

  function createPersonalExerciseObject(rawName) {
    return {
      _id: null, // temporary ID until backend saves it
      exerciseId: rawName, // or map this to your real exerciseId
      workoutId: workoutId, // you should have this in state/props
      userId: userId, // same here
      complete: false,
      reps: 0,
      sets: 0,
      weight: "0",
      distance: "0",
      duration: 0,
    };
  }

  useEffect(() => {
    if (!exercisesInProgressTable.length) {
      return;
    }

    const ids = exercisesInProgressTable.map((ex) => ex.exerciseId);
    const missing = ids.filter(
      id => !personalExNames[id] && exercises.some(ex => (ex._id ?? ex.exerciseId) === id)
    );


    if (missing.length === 0) {
      console.log("All names already loaded.");
      return;
    }

    const loadNames = async () => {
      try {
        const results = {};

        for (const id of missing) {
          const res = await fetch(
            `http://localhost:5000/AHFULexercises/id/${id}`,
          );
          const data = await res.json();

          results[id] = data.name;
        }

        setPersonalExNames((prev) => {
          const merged = { ...prev, ...results };
          return merged;
        });
      } catch (err) {
        console.error("Error fetching exercise names:", err);
      }
    };

    loadNames();
  }, [exercisesInProgressTable]);

  const updateField = (index, field, value) => {
    setExercisesInProgressTable((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

const handleSubmit = async () => {
  console.log("Submitting workout...");

  try {
    // POST each exercise in parallel
    const responses = await Promise.all(
      exercisesInProgressTable.map(ex =>
        fetch("http://localhost:5000/AHFULpersonalEx/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            complete: ex.complete,
            distance: ex.distance,
            duration: ex.duration,
            exerciseId: ex.exerciseId,   // external or internal normalized
            reps: ex.reps,
            sets: ex.sets,
            userId: ex.userId,
            weight: ex.weight,
            workoutId: ex.workoutId
          })
        })
      )
    );

    // Check for failures
    const failed = responses.filter(r => !r.ok);
    if (failed.length > 0) {
      console.error("Some exercises failed to save:", failed);
    } else {
      console.log("Workout saved successfully!");
    }

  } catch (err) {
    console.error("Error submitting workout:", err);
  }
};


  // useEffect 3: fetch available exercises from backend on mount
  useEffect(() => {
    fetch_exercises();
  }, []);

  const removeWorkout = (index) => {
    setExercisesInProgressTable((prev) => prev.filter((_, i) => i !== index));
  };

  // Append selected pending exercises to the in-progress table
  const addExerciseToWorkout = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (pendingExercises.length === 0) return;

    setExercisesInProgressTable((prev) => [
      ...prev,
      ...pendingExercises.map((name) => createPersonalExerciseObject(name)),
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
      const list = await searchExercises(searchQuery);
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
  // useEffect 4: manage workout timer interval while isRunning
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

  const formatTime = formatTimeFn;

  /////////////////////////////////////////////////////////////////////////////////////////
  /* Initial Page Load */
  /////////////////////////////////////////////////////////////////////////////////////////

  // Test id: user_id: 699d0093795741a59fe13616
  const userId = "699d0093795741a59fe13616";
  const [workout, setWorkout] = useState("");
  const [workoutId, setWorkoutId] = useState("");
  const [workoutTitle, setWorkoutTitle] = useState("");

  // useEffect 5: fetch current workout for the user on mount
  useEffect(() => {
    async function getWorkout() {
      try {
        const data = await fetchWorkout(userId);

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

  // useEffect 6: fetch personal exercises when workoutId changes
  useEffect(() => {
    if (!workoutId) return; // prevents running on initial render

    async function getPersonalEx() {
      try {
        console.log("Fetching personal exercises for workout:", workoutId);

        const data = await fetchPersonalExercises(workoutId);
        setExercisesInProgressTable(data);
      } catch (err) {
        console.error("Error fetching personal exercises:", err);
      }
    }

    getPersonalEx();
  }, [workoutId]); // <-- runs only when workoutId changes

  // useEffect 7: log exercisesInProgressTable updates for debugging
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
                <div className="cell">
                  {personalExNames[ex.exerciseId] || "ERROR"}
                </div>

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
                    checked={ex.complete}
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
                    const name = item.name;   // backend name
                    const id = item._id ?? item.exerciseId;      // backend ID

                    // Filter by name
                    if (
                      exerciseName &&
                      !name.toLowerCase().includes(exerciseName.toLowerCase())
                    ) {
                      return null;
                    }

                    // Check if selected
                    const isSelected = 
                      typeof id === "string" &&
                      pendingExercises.includes(id) &&
                      exercises.some(ex => (ex._id ?? ex.exerciseId) === id)

                    return (
                      <div
                        key={`item-${i}`}
                        className={`dropdown-item ${isSelected ? "selected" : ""}`}
                        onClick={() => {
                          setPendingExercises(prev => {
                            // Prevent invalid IDs from being added
                            if (!exercises.some(ex => (ex._id ?? ex.exerciseId) === id)) {
                              console.warn("Invalid exerciseId clicked:", id);
                              return prev;
                            }

                            if (prev.includes(id)) {
                              return prev.filter(p => p !== id);
                            }
                            return [...prev, id];
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
              {pendingExercises.map((id, i) => {
                const name = personalExNames[id] ||
                  exercises.find(ex => (ex._id ?? ex.exerciseId) === id)?.name ||
                  "(Unknown Exercise)";

                return (
                  <div key={i} className="pending-item">
                    <span>{name}</span>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() =>
                        setPendingExercises(prev =>
                          prev.filter((_, idx) => idx !== i)
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
        <div className="modal-overlay" onClick={closeNewExerciseModal}>
          <form
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleNewExerciseSave}
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

            <label style={{ display: "block", marginTop: 8 }}>Target Muscles</label>
            {muscleError && (
              <div style={{ color: "red", marginBottom: 6 }}>
                {muscleError}
              </div>
            )}
            <select
              multiple
              value={newExercise.targetMuscles}
              onChange={(e) => handleMultiSelectChange(e, "targetMuscles")}
              style={{ width: "100%" }}
            >
              {(muscleOptions || []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
              {(equipmentOptions || []).map((opt) => (
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
