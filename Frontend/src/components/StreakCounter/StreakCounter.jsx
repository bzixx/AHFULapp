import React from "react";
import "./StreakCounter.css";

export function StreakCounter({ count, type, loading }) {
  const icon = type === "workout" ? "🏋️" : "🍎";
  const label = type === "workout" ? "Workout Streak" : "Food Log Streak";
  const period = type === "workout" ? "days" : "days";

  if (loading) {
    return (
      <div className="streak-counter streak-loading">
        <div className="streak-icon-loading">🏃</div>
        <div className="streak-value-loading"></div>
        <div className="streak-label-loading"></div>
      </div>
    );
  }

  return (
    <div className={`streak-counter streak-${type}`}>
      <div className="streak-icon">{icon}</div>
      <div className="streak-value">
        <span className="streak-number">{count}</span>
        <span className="streak-period">{period}</span>
      </div>
      <div className="streak-label">{label}</div>
      {count > 0 && (
        <div className="streak-flame">🔥</div>
      )}
    </div>
  );
}
