import React, { useState, useRef, useEffect } from "react";

import "./Workout.css";
import "../../SiteStyles.css";
export function Workout() {
  /* Variables */
  const exercisesRef = useRef([
    { name: "Pushups", reps: 15, sets: 3, weight: "0", completed: false },
    {
      name: "Pullups",
      reps: 8,
      sets: 4,
      weight: "Full backpack",
      completed: false,
    },
    {
      name: "Squats",
      reps: 20,
      sets: 3,
      weight: "45 lbs",
      completed: false,
    },
    { name: "Run", reps: "-", sets: "-", weight: "0", completed: false },
  ]);

  const [exercises, setExercises] = useState(exercisesRef.current);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);

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
        <div className="workout-page">
          <div className="workout-card">
            <div className="workout-title">
              <h1>'WorkoutName'</h1>
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
          </div>
          <div className="workout-footer">
            <div className="workout-timer">{formatTime(time)}</div>

            <button className="workout-button" onClick={toggleTimer}>
              {isRunning ? "End" : "Start"}
            </button>
          </div>
        </div>
      </div>
      <div className="right-column"></div>
    </div>
  );
}
