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
  fetchTemplate,
  loadBodyParts,
  createExercise,
  createPersonalExercises,
  createWorkout,
  updateWorkout,
  updatePersonalExercises
} from "../../QueryFunctions";

export function WorkoutLogger() {
  const [templates, setTemplates] = useState([]);
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

  const [personalExToRemove, setPersonalExToRemove] = useState({});
  const [personalExNames, setPersonalExNames] = useState({});

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

  const [BodyPartOptions, setBodyPartOptions] = useState([]);
  const [BodyPartError, setBodyPartError] = useState(null);

  const [muscleOptions, setMuscleOptions] = useState([]);
  const [muscleError, setMuscleError] = useState(null);

  const [newExercise, setNewExercise] = useState(getDefaultNewExercise());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const resetNewExercise = () => setNewExercise(getDefaultNewExercise());

  const openNewExerciseModal = () => {
    resetNewExercise();
    setShowNewExerciseModal(true);
  };

  const closeNewExerciseModal = () => {
    setShowNewExerciseModal(false);
  };

  const handleNewExerciseSave = async (e) => {
    e.preventDefault();
    if (!newExercise.name.trim()) {
      alert("Please enter a name for the exercise");
      return;
    }

    setIsSaving(true);
    const result = await createExercise(newExercise);
    setIsSaving(false);

    if (result.error) {
      alert(`Failed to save exercise: ${result.error}`);
      return;
    }

    setExercises((prev) => [
      ...prev,
      { ...newExercise, _id: result.data.exercise_id },
    ]);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    closeNewExerciseModal();
    resetNewExercise();
  };

  const handleMultiSelectChange = (e, field) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setNewExercise((prev) => ({ ...prev, [field]: values }));
  };
  const searchTimeoutRef = useRef(null);

  const [templateSearch, setTemplateSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  function handleApplyTemplate(template) {
    console.log("Apply template:", template);
  }

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

    (async () => {
      const res = await loadBodyParts();
      if (!mounted) return;
      if (res && res.data) setBodyPartOptions(res.data);
      if (res && res.error) setBodyPartError(res.error);
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
        complete: !updated[index].complete,
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
    const missing = ids.filter((id) => !personalExNames[id]);

    if (missing.length === 0) {
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
    console.log("Submitting:", exercisesInProgressTable);
    console.log("Deleting:", personalExToRemove);

    try {
      // --- CREATE + UPDATE REQUESTS ---
      const saveRequests = exercisesInProgressTable.map((ex) => {
        const isNew = ex._id === null;

      const peData = isNew
    ? {
        complete: ex.complete,
        distance: ex.distance,
        duration: ex.duration,
        exerciseId: ex.exerciseId,
        reps: ex.reps,
        sets: ex.sets,
        userId: ex.userId,
        weight: ex.weight,
        workoutId: ex.workoutId
      }
    : {
        complete: ex.complete,
        distance: ex.distance,
        duration: ex.duration,
        reps: ex.reps,
        sets: ex.sets,
        weight: ex.weight
      };

      return isNew
          ? createPersonalExercises(peData)
          : updatePersonalExercises(ex._id, peData);
    });


      // --- DELETE REQUESTS ---
      const deleteRequests = Object.values(personalExToRemove)
        .filter((ex) => ex._id) // only delete DB-backed exercises
        .map((ex) =>
          fetch(`http://localhost:5000/AHFULpersonalEx/delete/${ex._id}`, {
            method: "DELETE",
          }),
        );

      // --- RUN EVERYTHING IN PARALLEL ---
      const responses = await Promise.all([...saveRequests, ...deleteRequests]);

      const failed = responses.filter((r) => !r.ok);

      if (failed.length > 0) {
        console.error("Some operations failed:", failed);
      } else {
        console.log("Workout saved successfully!");
      }

      // --- UPDATE WORKOUT endTime ---
      const workoutUpdatePayload = {
        endTime: workout.startTime + time, // your endTime variable
        startTime: workout.startTime, // keep original startTime
        title: workoutTitle, // keep original title
      };

    const workoutRes = await updateWorkout(workoutId, workoutUpdatePayload);

    if (workoutRes.error) {
      console.error("Failed to update workout:", workoutRes.error);
    } else {
      console.log("Workout updated successfully!");
    }

  } catch (err) {
    console.error("Error submitting workout:", err);
  }
};



  // useEffect 3: fetch available exercises from backend on mount
  useEffect(() => {
    fetch_exercises();
  }, []);

  const removePersonalEx = (index) => {
    setExercisesInProgressTable((prev) => {
      const removed = prev[index]; // the exercise being removed

      // Add removed exercise to personalExToRemove
      setPersonalExToRemove((prevRemoved) => ({
        ...prevRemoved,
        [removed._id || removed.exerciseId]: removed,
      }));

      // Return new table without the removed item
      return prev.filter((_, i) => i !== index);
    });
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
        // --- 1. Compute today at midnight ---
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentDateUnix = Math.floor(today.getTime() / 1000);

        // --- 2. Compute tomorrow at midnight ---
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowUnix = Math.floor(tomorrow.getTime() / 1000);

        // --- 3. Fetch ALL workouts for the user ---
        const allWorkouts = await fetchWorkout(userId); // your existing function

        if (!Array.isArray(allWorkouts)) {
          console.warn("Workout fetch returned invalid data:", allWorkouts);
          return;
        }

        // --- 4. Filter workouts by today's date range ---
        const todaysWorkouts = allWorkouts.filter(
          (w) => w.startTime >= currentDateUnix && w.startTime < tomorrowUnix,
        );

        // --- 5. If none exist, create a new workout ---
        if (todaysWorkouts.length === 0) {
          console.log("No workout found for today — creating new workout...");

        const newWorkoutPayload = {
          endTime: currentDateUnix,          // or 0 if you prefer
          gymId: "69af3c3e94310c6e29840229", // your real gymId
          startTime: currentDateUnix,        // midnight Unix timestamp
          title: "Workout (" + today.toDateString() + ")",
          userId: userId
        };

        console.log(newWorkoutPayload);

        const result = await createWorkout(newWorkoutPayload);

        if (result.error) {
          alert(`Failed to save workout: ${result.error}`);
          return;
        }

        setWorkout(result);
        setWorkoutId(result._id);
        setWorkoutTitle(result.title);
        setTime(workout.endTime - workout.startTime);
        return;
      }

        // --- 6. Otherwise load the existing workout ---
        const workout = todaysWorkouts[0];

        setWorkout(workout);
        setWorkoutId(workout._id);
        setWorkoutTitle(workout.title);
        setTime(workout.endTime - workout.startTime);
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
        const data = await fetchPersonalExercises(workoutId);
        setExercisesInProgressTable(data);
      } catch (err) {
        console.error("Error fetching personal exercises:", err);
      }
    }

    getPersonalEx();
  }, [workoutId]); // <-- runs only when workoutId changes

  // useEffect 7: fetch templates that user has created on load

  useEffect(() => {
    async function getTemplates() {
      try {
        const allTemplates = await fetchTemplate(userId);

        // Normalize if needed (backend might return null or object)
        if (Array.isArray(allTemplates)) {
          setTemplates(allTemplates);
        } else {
          setTemplates([]); // fallback
        }
      } catch (err) {
        console.error("Error fetching templates:", err);
      }
    }

    getTemplates();
  }, [userId]);

  function unixToDate(unix) {
    return new Date(unix * 1000).toLocaleDateString("en-US");
  }

  return (
    <div className="page-layout">
      <div className="left-column">
        <div className="template-container">
          <div className="add-template-form">
            {/* Search Bar */}
            <div className="dropdown-wrapper">
              <input
                type="text"
                placeholder="Search templates..."
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
              />

              <div className="dropdown-instructions">
                Select a template to apply
              </div>

              {/* Template List */}
              <div className="dropdown">
                {templates.length === 0 && (
                  <div className="dropdown-item">No templates found</div>
                )}

                {templates
                  .filter((t) => {
                    const title = t?.title ?? "";

                    // Keep selected template visible even if search doesn't match
                    if (selectedTemplate?._id === t._id) return true;

                    return title
                      .toLowerCase()
                      .includes(templateSearch.toLowerCase());
                  })
                  .map((t, i) => {
                    const isSelected = selectedTemplate?._id === t._id;

                    return (
                      <div
                        key={t._id ?? i}
                        className={`dropdown-item ${isSelected ? "selected" : ""}`}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedTemplate(null); // unselect
                          } else {
                            setSelectedTemplate(t); // select
                          }
                        }}
                      >
                        <span>{t.title ?? "Unnamed Template"}</span>
                        {isSelected && <span className="check">✓</span>}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div
              className="apply-btn-wrapper"
              style={{ display: "flex", gap: "8px" }}
            >
              {/* Apply Button */}
              {selectedTemplate && (
                <button
                  className="apply-btn"
                  onClick={() => handleApplyTemplate(selectedTemplate)}
                >
                  Apply Template
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="center-column">
        <div className="workout-card">
          <div className="workout-title">
            <input
              type="text"
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
            />
            {workout && <h3>{unixToDate(workout.startTime)}</h3>}
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
                  {ex.complete ? (
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
                  {ex.complete ? (
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
                  {ex.complete ? (
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
                    onClick={() => removePersonalEx(i)}
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
                {!loading &&
                  exercises.map((item, i) => {
                    console.log("Exercise item:", item);
                    const name = item.name; // backend name
                    const id = item._id ?? item.exerciseId; // backend ID

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
                      exercises.some((ex) => (ex._id ?? ex.exerciseId) === id);

                    return (
                      <div
                        key={`item-${i}`}
                        className={`dropdown-item ${isSelected ? "selected" : ""}`}
                        onClick={() => {
                          setPendingExercises((prev) => {
                            // Prevent invalid IDs from being added
                            if (
                              !exercises.some(
                                (ex) => (ex._id ?? ex.exerciseId) === id,
                              )
                            ) {
                              console.warn("Invalid exerciseId clicked:", id);
                              return prev;
                            }

                            if (prev.includes(id)) {
                              return prev.filter((p) => p !== id);
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
            {/* Display the list of exercises being added */}

            <div className="pending-list">
              {pendingExercises.map((id, i) => {
                const name =
                  personalExNames[id] ||
                  exercises.find((ex) => (ex._id ?? ex.exerciseId) === id)
                    ?.name ||
                  "(Unknown Exercise)";

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
      {/* Save Success Toast */}
      {saveSuccess && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#0a7b00",
            color: "white",
            padding: "12px 24px",
            borderRadius: 8,
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            zIndex: 3000,
          }}
        >
          Exercise saved successfully!
        </div>
      )}

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

            <label style={{ display: "block", marginTop: 8 }}>
              GIF URL (optional)
            </label>
            <input
              type="text"
              value={newExercise.gifUrl}
              onChange={(e) =>
                setNewExercise((p) => ({ ...p, gifUrl: e.target.value }))
              }
              placeholder="https://..."
              style={{ width: "100%" }}
            />
            {newExercise.gifUrl && newExercise.gifUrl.startsWith("http") && (
              <div style={{ marginTop: 8, textAlign: "center" }}>
                <img
                  src={newExercise.gifUrl}
                  alt="GIF Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "150px",
                    borderRadius: "8px",
                    border: "2px solid #000",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            )}

            <label style={{ display: "block", marginTop: 8 }}>
              Target Muscles
            </label>
            {muscleError && (
              <div style={{ color: "red", marginBottom: 6 }}>{muscleError}</div>
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
            {BodyPartError && (
              <div style={{ color: "red", marginBottom: 6 }}>
                {BodyPartError}
              </div>
            )}
            <select
              multiple
              value={newExercise.bodyParts}
              onChange={(e) => handleMultiSelectChange(e, "bodyParts")}
              style={{ width: "100%" }}
            >
              {(BodyPartOptions || []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
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
              <button type="submit" id="Sothat283763Me" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
