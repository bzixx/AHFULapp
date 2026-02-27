import "./CalendarButton.css";
import { useState, useEffect } from "react";
import { Calendar } from "../Calendar/Calendar.jsx";
/* Essentially the same as menu button, but without the list component on click */
export function CalendarButton({ trigger = undefined, setTrigger = undefined }) {
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
        <div className="calendar-button-wrapper">
            <div style={{ display: open ? "block" : "none" }}>
                <Calendar />
            </div>
            {/* Here as a reminder to change the icon of menu button and calendar button later */}
            <button
                className={`calendar-button-trigger ${open ? "active" : ""}`}
                onClick={toggle}
            >
                📅
            </button>
        </div>
    );
}