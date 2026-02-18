import React, { useState, useRef } from "react";

import "./Workout.css";
import "../../SiteStyles.css";
export function Workout() {
    
    const exercisesRef = useRef([
        { name: "Pushups", reps: 15, sets: 3, weight: "0", completed: false },
        { name: "Pullups", reps: 8, sets: 4, weight: "Full backpack", completed: true },
        { name: "Squats", reps: 20, sets: 3, weight: "45 lbs", completed: false },
        { name: "Run", reps: "-", sets: "-", weight: "0", completed: true }
    ]);

    const [exercises, setExercises] = useState(exercisesRef.current);

    const toggleCompleted = (index) => {
    exercisesRef.current[index].completed =
        !exercisesRef.current[index].completed;

    setExercises([...exercisesRef.current]); // force re-render
    };


    const updateField = (index, field, value) => {
    setExercises(prev => {
        const updated = [...prev];
        updated[index][field] = value;
        return updated;
    });
    };

    
    return (
        <div className = "workout-page">
            <div className = "workout-card">
                <div className = "workout-title">
                    <h1>'WorkoutName'</h1>
                </div>

                <div className="workout-grid">
                    <div className="cell header">Exercise</div>
                    <div className="cell header">Reps</div>
                    <div className="cell header">Sets</div>
                    <div className="cell header">Weight</div>
                    <div className="cell header">Completed</div>

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
                        </React.Fragment>
                    ))}
                    </div>

            </div>
        </div>
    );
}