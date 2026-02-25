import React, { useState, useRef, useEffect } from "react";

import "./Workout.css";
import "../../SiteStyles.css";
export function Workout({
    trigger = undefined,
    setTrigger = undefined,
}) {

  /* Variables */
  const exercisesRef = useRef([
    { name: "Push Ups", reps: 15, sets: 3, weight: "0", completed: false },
    { name: "Pull Ups", reps: 8, sets: 4, weight: "Full backpack", completed: false },
    { name: "Squats", reps: 20, sets: 3, weight: "45 lbs", completed: false },
    { name: "Run", reps: "-", sets: "-", weight: "0", completed: false },
  ]);

  const [exerciseList, setExerciseList] = useState([
    "Push Ups",
    "Pull Ups",
    "Squats",
    "Bench Press",
    "Deadlift",
    "Overhead Press",
    "Bicep Curls",
    "Tricep Dips",
    "Lunges",
    "Plank",
    "Burpees",
    "Running"
  ]);


  const [showDropdown, setShowDropdown] = useState(false);
  const [open, setOpen] = useState(Boolean(trigger));
  const [exercises, setExercises] = useState(exercisesRef.current);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [exerciseName, setExerciseName] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [pendingExercises, setPendingExercises] = useState([]);



  /* Functions */

  /* Exercise Functions */
  const removeWorkout = (index) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCompleted = (index) => {
    exercisesRef.current[index].completed =
      !exercisesRef.current[index].completed;

    setExercises([...exercisesRef.current]); // force re-render
  };

  const updateField = (index, field, value) => {
    setExercises((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = () => {
    console.log("Submitted workout!");
    // TODO: Update the workout by grabbing the workout id and user id
  };


  useEffect(() => {
    if (typeof trigger !== "undefined") {
        setOpen(Boolean(trigger));
    }
  }, [trigger]);

  const toggle = () => {
      if (typeof setTrigger === "function") {
          setTrigger(!trigger);
      } else {
          setOpen((s) => !s);
      }
  };

  const addExerciseToWorkout = (e) => {
    e.preventDefault();

    if (pendingExercises.length === 0) return;

    pendingExercises.forEach(name => {
      exercisesRef.current.push({
        name,
        reps: "-",
        sets: "-",
        weight: "0",
        completed: false,
      });
    });

    setPendingExercises([]);   // clear the list
    setExerciseName("");       // clear input
    setRefresh(r => r + 1);    // re-render
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
            {exercises.map((ex, i) => (
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
                      onChange={(e) =>
                        updateField(i, "weight", e.target.value)
                      }
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
            <div className="workout-actions-left-side">
              <button 
                className="workout-add-exercise-btn"
                onClick={toggle}
              >
                ➕
              </button>
              <div className="workout-add-exercise-text">Add Exercise</div>
            </div>

            <div className="workout-actions-right-side">
              <button className="workout-submit-button" onClick={handleSubmit}>
              Submit
              </button>
            </div>
          </div>
        </div>
        <div className="workout-footer">
          <div className="workout-timer">{formatTime(time)}</div>

          <button className="workout-timer-button" onClick={toggleTimer}>
            {isRunning ? "Stop Timer" : "Start Timer"}
          </button>
        </div>
      </div>
      <div className="right-column">
        <div className={`add-exercise ${open ? "open" : "closed"}`}>
          <form onSubmit={addExerciseToWorkout} className="add-exercise-form">
            <div className="dropdown-wrapper">
              <input
                type="text"
                placeholder="Search exercises..."
                value={exerciseName}
                onChange={(e) => {
                  setExerciseName(e.target.value);
                  setShowDropdown(true);
                }}
              />

              {showDropdown && exerciseName && (
                <div className="dropdown">
                  {exerciseList
                    .filter(name =>
                      name.toLowerCase().includes(exerciseName.toLowerCase())
                    )
                    .map((name, i) => (
                      <div
                        key={i}
                        className="dropdown-item"
                        onClick={() => {
                          // Add to list
                          setPendingExercises(prev => [...prev, name]);
                          setExerciseName("");
                          setShowDropdown(false);
                        }}
                      >
                        {name}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Display the list of exercises being added */}
            {/* TODO: Show muscle group too or PR */}
            <div className="pending-list">
              {pendingExercises.map((ex, i) => (
                <div key={i} className="pending-item">
                  <span>{ex}</span>
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
              ))}
            </div>

          <div className="add-btn-wrapper">
            <button className="add-btn" type="submit">Add Exercises</button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}
