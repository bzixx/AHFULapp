import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import "./WorkoutLogger.css";
import "../../SiteStyles.css";
import { CalendarButton } from "../../components/CalendarButton/CalendarButton.jsx";
import {
  getDefaultNewExercise,
  formatTime as formatTimeFn,
  loadEquipment as loadEquipmentFn,
  loadTargetMuscles,
  fetchExercisesFromBackend,
  searchExercises,
  fetchWorkout,
  fetchWorkoutById,
  fetchPersonalExercises,
  fetchExerciseById,
  createWorkout,
  updateWorkout,
  createPersonalExercise,
  updatePersonalExercise,
  deletePersonalExercise,
  fetchTemplate,
  createTemplate,
  loadBodyParts,
  createExercise,
} from "../../QueryFunctions";

/**
 * WorkoutLogger - Main workout tracking page
 *
 * Features:
 * - Create/manage daily workouts
 * - Add exercises from the database
 * - Create custom exercises
 * - Track reps, sets, weight for each exercise
 * - Workout timer
 *
 * Auth Flow:
 * - Gets user from Redux auth state
 * - Creates a default workout for today if none exists
 * - Loads existing personal exercises for the workout
 */
export function WorkoutLogger() {
  // ─── Redux Auth State ─────────────────────────────────────────────────────────
  const user = useSelector((state) => state.auth.user);
  const userAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const selectedDate = useSelector((state) => state.calendar.selectedDate);

  // ─── Personal Exercise State ──────────────────────────────────────────────────
  // Tracks exercises to be deleted when workout is submitted (removed from UI but need DB deletion)
  const [personalExToRemove, setPersonalExToRemove] = useState({});
  // Maps exercise IDs to their display names (fetched from backend)
  const [personalExNames, setPersonalExNames] = useState({});
  // Exercises currently in the workout (reps, sets, weight, completed status)
  /* Hook to track state of the InProgressTable on the Workout Page */
  const [exercisesInProgressTable, setExercisesInProgressTable] = useState([]);

  // ─── Exercise Database State ──────────────────────────────────────────────────
  // All exercises available in the database
  const [exercises, setExercises] = useState([]);
  // Exercise list loading state
  const [exerciseLoading, setExerciseLoading] = useState(false);
  // Error state for exercise operations
  const [error, setError] = useState(null);

  // ─── Workout State ───────────────────────────────────────────────────────────
  // Current workout object from database
  const [workout, setWorkout] = useState(null);
  // Current workout ID (used for API calls)
  const [workoutId, setWorkoutId] = useState("");
  // User-editable workout title
  const [workoutTitle, setWorkoutTitle] = useState("");
  // Workout loading state
  const [workoutLoading, setWorkoutLoading] = useState(true);
  // Workout error state
  const [workoutError, setWorkoutError] = useState(null);

  // ─── Timer State ─────────────────────────────────────────────────────────────
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

  // ─── Exercise Selection State ────────────────────────────────────────────────
  const [exerciseName, setExerciseName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Selected exercise IDs pending to be added to workout
  const [pendingExercises, setPendingExercises] = useState([]);
  // Modal visibility for creating new exercises
  const [showNewExerciseModal, setShowNewExerciseModal] = useState(false);

  // ─── New Exercise Form States
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [equipmentError, setEquipmentError] = useState(null);
  const [BodyPartOptions, setBodyPartOptions] = useState([]);
  const [BodyPartError, setBodyPartError] = useState(null);
  const [muscleOptions, setMuscleOptions] = useState([]);
  const [muscleError, setMuscleError] = useState(null);
  const [newExercise, setNewExercise] = useState(getDefaultNewExercise());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ─── Template States
  const [templateSearch, setTemplateSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templatePreview, setTemplatePreview] = useState(null);
  const [templates, setTemplates] = useState([]);

  // ─── Refs ───────────────────────────────────────────────────────────────────
  const searchTimeoutRef = useRef(null);

  // ─── Utility Functions ───────────────────────────────────────────────────────
  const resetNewExercise = () => setNewExercise(getDefaultNewExercise());

  const unixToDate = (unix) => {
    return new Date(unix * 1000).toLocaleDateString("en-US");
  };

  // ─── Modal Handlers ─────────────────────────────────────────────────────────
  const openNewExerciseModal = () => {
    resetNewExercise();
    setShowNewExerciseModal(true);
  };

  const closeNewExerciseModal = () => {
    setShowNewExerciseModal(false);
  };

  // ─── New Exercise Form Handler ────────────────────────────────────────────────
  const handleNewExerciseSave = async (e) => {
    e.preventDefault();
    if (!newExercise.name.trim()) {
      alert("Please enter a name for the exercise");
      return;
    }

    setIsSaving(true);
    try {
      const result = await createExercise(newExercise);

      if (result.error) {
        alert(`Failed to save exercise: ${result.error}`);
        return;
      }

      // Add the new exercise to the local list
      setExercises((prev) => [
        ...prev,
        { ...newExercise, _id: result.data.exercise_id },
      ]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      closeNewExerciseModal();
      resetNewExercise();
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Multi-select Handler for Exercise Form ─────────────────────────────────
  const handleMultiSelectChange = (e, field) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setNewExercise((prev) => ({ ...prev, [field]: values }));
  };

  // useEffect 1: cleanup debounced search timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  // ─── Load Exercise Options on Mount ──────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    // Load equipment options
    (async () => {
      const res = await loadEquipmentFn();
      if (!mounted) return;
      if (res && res.data) setEquipmentOptions(res.data);
      if (res && res.error) setEquipmentError(res.error);
    })();

    // Load muscle options
    (async () => {
      const res = await loadTargetMuscles();
      if (!mounted) return;
      if (res && res.data) setMuscleOptions(res.data);
      if (res && res.error) setMuscleError(res.error);
    })();

    // Load body part options
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

  // ─── Cleanup Search Timeout on Unmount ────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  // ─── Load Exercises from Database ─────────────────────────────────────────────
  const fetch_exercises = async () => {
    setExerciseLoading(true);
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
      setExerciseLoading(false);
    }
  };

  useEffect(() => {
    fetch_exercises();
  }, []);

  // ─── Toggle Exercise Completion ───────────────────────────────────────────────
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

  // ─── Update Exercise Field (reps, sets, weight) ───────────────────────────────
  const updateField = (index, field, value) => {
    setExercisesInProgressTable((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // ─── Load Exercise Names for Display ─────────────────────────────────────────
  // When exercises are added to the workout or showing the template preview ,
  // we need to fetch their display names
  useEffect(() => {
    // Collect IDs from workout table
    //const workoutIds = exercisesInProgressTable.map((ex) => ex.exerciseId);
    const workoutIds = exercisesInProgressTable.map((ex) => {
      return ex.exercise_id;
    });

    // Collect IDs from template preview
    const templateIds =
      templatePreview?.exercises?.map((ex) => ex.exercise_id) || [];

    // Combine and dedupe
    const allIds = [...new Set([...workoutIds, ...templateIds])];

    if (allIds.length === 0) return;

    // Filter missing names
    const missing = allIds.filter((id) => !personalExNames[id]);

    if (missing.length === 0) return;

    const loadNames = async () => {
      try {
        const results = {};

        for (const id of missing) {
          try {
            const data = await fetchExerciseById(id);
            results[id] = data.name;
          } catch (err) {
            console.error("Error fetching exercise name for", id, err);
            results[id] = "Unknown Exercise";
          }
        }

        setPersonalExNames((prev) => ({ ...prev, ...results }));
      } catch (err) {
        console.error("Error fetching exercise names:", err);
      }
    };

    loadNames();
  }, [exercisesInProgressTable, templatePreview]);

  // ─── Save Template ───────────────────────────────────────────────────────────
  // Saves personal exercises as a template using the workout name
  const saveTemplate = async () => {
    try {
      if (!workoutTitle || !user?._id) {
        alert("Cannot save template — missing workout or user.");
        return;
      }
      if (exercisesInProgressTable === 0) {
        alert("No exercises to save.");
        return;
      }

      // 1. Create the template
      const templatePayload = {
        title: workoutTitle,
        user_id: user._id,
      };

      const template = await createTemplate(templatePayload);

      if (!template.success) {
        throw new Error("Failed to create template");
      }

      // 2. Create personalExercises using template._id as workoutId
      for (const ex of exercisesInProgressTable) {
        const personalExPayload = {
          exercise_id: ex.exercise_id,
          reps: ex.reps,
          sets: ex.sets,
          weight: ex.weight,
          duration: ex.duration,
          distance: ex.distance,
          complete: false,
          user_id: user._id,
          workout_id: template.data.workout_id,
          template: true,
        };
        createPersonalExercise(personalExPayload);
      }

      alert("Template has been saved!");
    } catch (err) {
      console.error("Error saving template:", err);
      alert("Failed to save template.");
    }
  };

  async function handleApplyTemplate(template) {
    try {
      const templateExercises = await fetchPersonalExercises(template._id);

      // Open popup
      setTemplatePreview({
        template,
        exercises: templateExercises,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load template exercises.");
    }
  }

  function handleConfirmTemplateApply() {
    // 1. Move current exercises → personalExToRemove
    setPersonalExToRemove((prev) => {
      const removed = { ...prev };

      exercisesInProgressTable.forEach((ex) => {
        const key = ex._id || ex.exercise_id;
        removed[key] = ex;
      });

      return removed;
    });

    // 2. Replace exercisesInProgressTable with template exercises
    setExercisesInProgressTable(
      templatePreview.exercises.map((ex) => ({
        ...ex,
        _id: null, // mark as new
        workout_id: workoutId,
        user_id: user._id, // ensure backend treats them as new
      })),
    );

    // 3. Close popup
    setTemplatePreview(null);
  }

  // ─── Submit Workout ───────────────────────────────────────────────────────────
  // Saves all exercise changes and updates workout end time

  const handleSubmit = async () => {
    console.log("Submitting workout...");

    try {
      // --- CREATE + UPDATE REQUESTS ---
      const saveRequests = exercisesInProgressTable.map((ex) => {
        const isNew = ex._id === null;

        const peData = isNew
          ? {
              complete: ex.complete,
              distance: ex.distance,
              duration: ex.duration,
              exercise_id: ex.exercise_id,
              reps: ex.reps,
              sets: ex.sets,
              user_id: ex.user_id,
              weight: ex.weight,
              workout_id: ex.workout_id,
            }
          : {
              complete: ex.complete,
              distance: ex.distance,
              duration: ex.duration,
              reps: ex.reps,
              sets: ex.sets,
              weight: ex.weight,
            };

        return isNew
          ? createPersonalExercise(peData)
          : updatePersonalExercise(ex._id, peData);
      });

      // --- DELETE REQUESTS ---
      const deleteRequests = Object.values(personalExToRemove)
        .filter((ex) => ex._id) // only delete DB-backed exercises
        .map((ex) => deletePersonalExercise(ex._id));

      // --- RUN EVERYTHING IN PARALLEL ---
      const responses = await Promise.all([...saveRequests, ...deleteRequests]);

      const failed = responses.filter((r) => r == null || r.error);

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

      alert("Workout has been submitted and saved!");
    } catch (err) {
      console.error("Error submitting workout:", err);
    }
  };

  // ─── Remove Exercise from Workout ─────────────────────────────────────────────
  // Removes from UI but queues for deletion on submit
  const removePersonalEx = (index) => {
    setExercisesInProgressTable((prev) => {
      const removed = prev[index]; // the exercise being removed

      // Add removed exercise to personalExToRemove
      setPersonalExToRemove((prevRemoved) => ({
        ...prevRemoved,
        [removed._id || removed.exerciseId]: removed,
      }));
      return prev.filter((_, i) => i !== index);
    });
  };

  // Append selected pending exercises to the in-progress table
  const addExerciseToWorkout = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    // Ensure workout is loaded before adding exercises
    if (!workoutId) {
      console.warn("Cannot add exercises - workout not loaded yet");
      return;
    }

    if (pendingExercises.length === 0) return;

    // Create exercise objects with workout context
    const newExercises = pendingExercises.map((rawName) => ({
      _id: null, // null = new exercise, will be assigned ID after DB save
      exercise_id: rawName,
      workout_id: workoutId,
      user_id: user._id,
      complete: false,
      reps: 0,
      sets: 0,
      weight: "0",
      distance: "0",
      duration: 0,
    }));

    setExercisesInProgressTable((prev) => [...prev, ...newExercises]);
    setPendingExercises([]);
    setExerciseName("");
  };

  // ─── Search Exercises ─────────────────────────────────────────────────────────
  const handleSearch = async (query) => {
    const searchQuery = typeof query === "string" ? query : exerciseName;

    if (!searchQuery) {
      setSearchTerm(exerciseName);
      fetchExercises(exerciseName);
    }

    setExerciseLoading(true);
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
      setExerciseLoading(false);
    }
  };

  // ─── Timer Logic ──────────────────────────────────────────────────────────────
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

  // ─── Load or Create Today's Workout ───────────────────────────────────────────
  useEffect(() => {
    // Don't proceed if user isn't logged in
    if (!userAuthenticated) {
      setWorkoutLoading(false);
      return;
    }

    async function getWorkout() {
      try {
        setWorkoutLoading(true);
        setWorkoutError(null);

        // Calculate today's date range (midnight to midnight)
        const today = selectedDate ? new Date(selectedDate) : new Date();
        today.setHours(0, 0, 0, 0);
        const currentDateUnix = Math.floor(today.getTime() / 1000);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowUnix = Math.floor(tomorrow.getTime() / 1000);

        // Fetch all workouts for this user
        const allWorkouts = await fetchWorkout(user._id);

        // Filter to today's workouts only
        const todaysWorkouts = allWorkouts.filter(
          (w) => w.startTime >= currentDateUnix && w.startTime < tomorrowUnix,
        );

        // If no workout exists for today, create one
        if (todaysWorkouts.length === 0) {
          console.log("No workout found for today — creating new workout...");

          // Hardcoded gym ID (should be user preference in future)
          const gymId = "69af3c3e94310c6e29840229";

          const newWorkoutPayload = {
            endTime: currentDateUnix,
            gym_id: gymId,
            startTime: currentDateUnix,
            title: "Workout (" + today.toDateString() + ")",
            user_id: user._id,
          };

          const newWorkout = await createWorkout(newWorkoutPayload);

          // Immediately fetch the persisted version
          const persisted = await fetchWorkoutById(newWorkout._id);

          setWorkout(persisted);
          setWorkoutId(persisted._id);
          setWorkoutTitle(persisted.title);
          setTime(0);
          return;
        }

        // Load existing workout for today
        const existingWorkout = todaysWorkouts[0];
        setWorkout(existingWorkout);
        setWorkoutId(existingWorkout._id);
        setWorkoutTitle(existingWorkout.title);
        setTime(existingWorkout.endTime - existingWorkout.startTime);
      } catch (err) {
        console.error("Error fetching workout:", err);
        setWorkoutError(err.message || "Failed to load workout");
      } finally {
        setWorkoutLoading(false);
      }
    }

    getWorkout();
  }, [userAuthenticated, workoutId]);

  // ─── Load Personal Exercises for Current Workout ───────────────────────────────
  useEffect(() => {
    if (!workoutId) return;

    async function getPersonalEx() {
      try {
        const data = await fetchPersonalExercises(workoutId);
        setExercisesInProgressTable(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching personal exercises:", err);
      }
    }

    getPersonalEx();
  }, [workoutId]);

  // useEffect: fetch templates that user has created on load
  useEffect(() => {
    async function getTemplates() {
      try {
        const allTemplates = await fetchTemplate(user._id);

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
  }, [user._id]);

  // ─── Loading State ────────────────────────────────────────────────────────────
  if (workoutLoading) {
    return (
      <div className="page-layout">
        <div className="center-column">
          <div className="workout-card">
            <h2>Loading workout...</h2>
            <p>Please wait while we set up your workout.</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────────────────────
  if (workoutError) {
    return (
      <div className="page-layout">
        <div className="center-column">
          <div className="workout-card">
            <h2>Error Loading Workout</h2>
            <p>{workoutError}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Render ─────────────────────────────────────────────────────────────
  return (
    <div className="page-layout">
      <CalendarButton />
      {/* Left Column: Template/History */}
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

      {/* Center Column: Workout Card */}
      <div className="center-column">
        <div className="workout-card">
          {/* Workout Title & Date */}
          <div className="workout-title">
            <input
              type="text"
              value={workoutTitle}
              onChange={(e) => setWorkoutTitle(e.target.value)}
            />
            <h3>{workout?.startTime ? unixToDate(workout.startTime) : ""}</h3>
          </div>

          {/* Exercise Table */}
          <div className="workout-grid">
            <div className="cell workout-grid-header">Exercise</div>
            <div className="cell workout-grid-header">Reps</div>
            <div className="cell workout-grid-header">Sets</div>
            <div className="cell workout-grid-header">Weight</div>
            <div className="cell workout-grid-header">Completed</div>
            <div className="cell workout-grid-header"></div>

            {exercisesInProgressTable.map((ex, i) => (
              <React.Fragment key={i}>
                <div className="cell">
                  {personalExNames[ex.exercise_id] || "Loading..."}
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
                    onChange={() => toggleCompleted(i)}
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

          {/* Submit Button */}
          <div className="workout-actions">
            <div className="workout-actions-left-side">
              <button className="workout-submit-button" onClick={saveTemplate}>
                Save as Template
              </button>
            </div>
            <div className="workout-actions-right-side">
              <button className="workout-submit-button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Timer Footer */}
        <div className="workout-footer">
          <div className="workout-timer-box workout-timer">
            {formatTimeFn(time)}
          </div>
          <button
            className="workout-timer-box workout-timer-button"
            onClick={toggleTimer}
          >
            {isRunning ? "Stop Timer" : "Start Timer"}
          </button>
        </div>
      </div>

      {/* Right Column: Exercise Search & Selection */}
      <div className="right-column">
        <div className="add-exercise">
          <div className="add-exercise-form">
            {/* Search Input */}
            <div className="dropdown-wrapper">
              <div className="search-row">
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                />

                <button
                  type="button"
                  className="search-btn"
                  onClick={() => handleSearch(exerciseName)}
                >
                  Search
                </button>
              </div>

              <div className="dropdown-instructions">
                Click an exercise to select it
              </div>

              {/* Exercise List Dropdown */}
              <div className="dropdown">
                {exerciseLoading && (
                  <div className="dropdown-item">Loading...</div>
                )}
                {!exerciseLoading && exercises.length === 0 && (
                  <div className="dropdown-item">No exercises found</div>
                )}
                {!exerciseLoading &&
                  exercises
                    .filter((ex) => ex && (ex.name || ex._id || ex.exercise_id)) // remove empty objects
                    .map((item, i) => {
                      const name = item.name ?? "";
                      const id = item._id ?? item.exerciseId;

                      // Filter by search term
                      if (
                        searchTerm &&
                        !name.toLowerCase().includes(searchTerm.toLowerCase())
                      ) {
                        return;
                      }

                      // Check if already selected
                      const isSelected =
                        typeof id === "string" &&
                        pendingExercises.includes(id) &&
                        exercises.some(
                          (ex) => (ex._id ?? ex.exerciseId) === id,
                        );

                      return (
                        <div
                          key={`item-${i}`}
                          className={`dropdown-item ${isSelected ? "selected" : ""}`}
                          onClick={() => {
                            setPendingExercises((prev) => {
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

            {/* Pending Exercises List */}
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

            {/* Action Buttons */}
            <div
              className="add-btn-wrapper"
              style={{ display: "flex", gap: "8px" }}
            >
              <button
                className="workout-add-selected-button add-btn"
                id="add-exercises-btn"
                type="button"
                onClick={() => addExerciseToWorkout()}
                disabled={!workoutId}
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
              <button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {templatePreview && (
        <div className="template-overlay">
          <div className="template-modal">
            <h2>{templatePreview.template.templateName}</h2>

            <div className="template-grid">
              <div className="cell template-grid-header">Exercise</div>
              <div className="cell template-grid-header">Reps</div>
              <div className="cell template-grid-header">Sets</div>
              <div className="cell template-grid-header">Weight</div>

              {templatePreview.exercises.map((ex, i) => (
                <React.Fragment key={ex._id || i}>
                  <div className="cell" title={personalExNames[ex.exercise_id]}>
                    {personalExNames[ex.exercise_id]}
                  </div>

                  <div className="cell">{ex.reps}</div>
                  <div className="cell">{ex.sets}</div>
                  <div className="cell">{ex.weight}</div>
                </React.Fragment>
              ))}
            </div>

            <button
              className="template-confirm-btn"
              onClick={handleConfirmTemplateApply}
            >
              Confirm
            </button>

            <button
              className="template-cancel-btn"
              onClick={() => setTemplatePreview(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
