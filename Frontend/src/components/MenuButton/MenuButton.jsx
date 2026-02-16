import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./MenuButton.css";
/* Excluding Map, Measurement Logger, Workout History, and TOS 
   to add them to other pages later in hopes of keeping a cleaner look */
export function MenuButton({
    trigger = undefined,
    setTrigger = undefined,
}) {
    const [open, setOpen] = useState(Boolean(trigger));

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

    return (
        <div className="menu-container">
            
            <div className={`menu ${open ? "open" : "closed"}`}>
                <Link to="/FoodLog">Food Log</Link>
                <Link to="/ExerciseLogger">Exercise Logger</Link>
                <Link to="/ExploreWorkout">Explore Workouts</Link>
                <Link to="/CreateTemplate">Create Template</Link>
                <Link to="/Profile">Profile</Link>
            </div>

            <button
                className={`menu-button ${open ? "active" : ""}`}
                onClick={toggle}
            >
                ❚█══█❚
            </button>

        </div>
    );
}
