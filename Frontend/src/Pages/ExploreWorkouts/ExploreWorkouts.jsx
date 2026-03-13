import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./ExploreWorkouts.css";
import "../../SiteStyles.css";
import {registerService} from "../../firebase.js";
import { Calendar } from "../../components/Calendar/Calendar";


export function ExploreWorkouts() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  // Workout history graph state (derived from exercises)
  const [weeklyData, setWeeklyData] = useState([]);

  // Fetch exercises from our backend.
  // The backend registers the blueprint at /exercises (see Backend/APIRoutes/ExerciseRoutes.py).
  // The endpoint may return either a raw array (e.g. [ {name:...}, ... ])
  // or an envelope like { data: [...] } or { results: [...] } depending on the backend.
  // We try to be flexible and handle the common shapes.
  const fetchExercises = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use a relative path so the dev server proxy (if configured) will forward to backend.
      const res = await fetch("http://localhost:5000/AHFULworkout");

      //If Response is not OK, try to extract more info from the body and Throw
      if (!res.ok) {
        // Provide a clearer error including body text when possible
        let bodyText = "";
        try {
          bodyText = await res.text();
        } catch (e) {
          /* ignore */
        }
        throw new Error(`Server returned ${res.status} ${res.statusText} ${bodyText}`);
      }

      //
      const data = await res.json();
      setExercises(data);
    } catch (err) {

      // Log the full error for debugging
      console.error("Failed to fetch exercises:", err);
      // Some Error objects (DOMExceptions) have a name and message
      const friendly = err && err.name ? `${err.name}: ${err.message}` : String(err);
      setError(friendly || "Unknown error");
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  // Aggregate exercises into weekly buckets for the graph
  function getWeekInfo(date) {
    const d = new Date(date);
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - (day - 1));
    const month = d.toLocaleString("default", { month: "short" });
    const label = `Week of ${month} ${d.getDate()}`;
    const sortKey = d.toISOString().slice(0, 10);
    return { label, sortKey };
  }

  useEffect(() => {
    if (!exercises || exercises.length === 0) {
      setWeeklyData([]);
      return;
    }
    const buckets = {};
    exercises.forEach((w) => {
      if (!w.startTime) return;
      const { label, sortKey } = getWeekInfo(w.startTime);
      if (!buckets[sortKey]) buckets[sortKey] = { label, count: 0 };
      buckets[sortKey].count += 1;
    });
    const aggregated = Object.entries(buckets)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([, { label, count }]) => ({ week: label, workouts: count }));
    setWeeklyData(aggregated);
  }, [exercises]);

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div className="explore-root">
      <header className="explore-header">
        <h1>Explore Workouts</h1>
        <div>
          <button onClick={fetchExercises} disabled={loading} className="refresh-btn">
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button onClick={registerService} className="refresh-btn">
            Register Workout Notifications!
          </button>
        </div>
      </header>

      <div className="explore-content">
        {/* Left column: saved workouts */}
        <div className="explore-left">
          {error && <div className="explore-error">Error: {error}</div>}

          {!error && (
            <div className="exercise-list">
              {loading && exercises.length === 0 ? (
                <div className="explore-loading">Loading exercises…</div>
              ) : exercises.length === 0 ? (
                <div className="explore-empty">No exercises found.</div>
              ) : (
                exercises.map((ex, idx) => {
                  const key = ex.id || ex._id || ex.name || `exercise-${idx}`;
                  return (
                    <div key={key} className="exercise-item">
                      <div className="exercise-main">
                        <div className="exercise-name">{ex.title || "Untitled"}</div>
                        <div className="exercise-meta">
                          {ex.startTime && <span>Start: {ex.startTime}</span>}
                          {ex.endTime && <span> • End: {ex.endTime}</span>}
                          {ex.gymId && <span> • Gym: {ex.gymId}</span>}
                        </div>
                      </div>
                      {ex.instructions && <div className="exercise-instructions">{ex.instructions}</div>}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Right column: workout history graph */}
        <div className="explore-right">
          <div className="wh-chart-section">
            <h2 className="wh-chart-heading">Workouts Per Week</h2>
            {loading ? (
              <p className="wh-status">Loading workout history...</p>
            ) : weeklyData.length === 0 ? (
              <p className="wh-status">No workouts recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="week"
                    label={{ value: "Week", position: "insideBottom", offset: -5 }}
                    tick={{ fontSize: 12 }}
                    tickLine={{ strokeWidth: 2, stroke: "#333" }}
                    tickSize={8}
                  />
                  <YAxis allowDecimals={false} label={{ value: "Number of Workouts", angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="workouts" fill="#4f46e5" name="Workouts" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
              <Calendar />
    </div>
  );
}
