//@Author Jonathan Torrence
import React, {useState, useEffect} from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "./WorkoutHistory.css";
import "../../SiteStyles.css";
export function WorkoutHistory() {
    const [weeklyData, setWeeklyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      fetchAndAggregateWorkouts();
    }, []);

    function getWeekInfo(date) {
      const d = new Date(date);
      // Get Monday of that week
      const day = d.getDay() || 7;
      d.setDate(d.getDate() - (day - 1));
      const month = d.toLocaleString("default", { month: "short" });
      const label = `Week of ${month} ${d.getDate()}`;
      // sortKey is YYYY-MM-DD for reliable chronological sorting
      const sortKey = d.toISOString().slice(0, 10);
      return { label, sortKey };
    }

    async function fetchAndAggregateWorkouts() {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem("userData"));

        let workouts;

        if (!userData?.email) {
          // ============================================================
          // TODO: DELETE this mock data block once login feature is fixed.
          // This allows testing the chart without being logged in.
          // ============================================================
          workouts = [
            { startTime: "2026-02-02T08:00:00", endTime: "2026-02-02T09:00:00" },
            { startTime: "2026-02-04T08:00:00", endTime: "2026-02-04T09:30:00" },
            { startTime: "2026-02-05T08:00:00", endTime: "2026-02-05T08:45:00" },
            { startTime: "2026-02-10T08:00:00", endTime: "2026-02-10T09:00:00" },
            { startTime: "2026-02-12T08:00:00", endTime: "2026-02-12T09:15:00" },
            { startTime: "2026-02-14T08:00:00", endTime: "2026-02-14T08:30:00" },
            { startTime: "2026-02-15T08:00:00", endTime: "2026-02-15T09:00:00" },
            { startTime: "2026-02-19T08:00:00", endTime: "2026-02-19T10:00:00" },
            { startTime: "2026-02-21T08:00:00", endTime: "2026-02-21T09:00:00" },
            { startTime: "2026-02-23T08:00:00", endTime: "2026-02-23T09:45:00" },
            { startTime: "2026-02-24T08:00:00", endTime: "2026-02-24T08:50:00" },
            { startTime: "2026-02-25T08:00:00", endTime: "2026-02-25T09:00:00" },
          ];
          // ============================================================
        } else {
          const res = await fetch(
            `http://localhost:5000/AHFULworkout/${encodeURIComponent(userData.email)}`
          );
          if (!res.ok) throw new Error("Failed to fetch workouts");
          workouts = await res.json();
        }

        if (!workouts || workouts.length === 0) {
          setWeeklyData([]);
          setLoading(false);
          return;
        }
        const buckets = {};
        workouts.forEach((w) => {
          const { label, sortKey } = getWeekInfo(w.startTime);
          if (!buckets[sortKey]) buckets[sortKey] = { label, count: 0 };
          buckets[sortKey].count += 1;
        });
        const aggregated = Object.entries(buckets)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([, { label, count }]) => ({ week: label, workouts: count }));
        setWeeklyData(aggregated);
      }catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (loading) return <div className="workout-history-page"><p className="wh-status">Loading workout history...</p></div>;
    if (error) return <div className="workout-history-page"><p className="wh-status wh-error">{error}</p></div>;
    if (weeklyData.length === 0)
      return <div className="workout-history-page"><p className="wh-stats">No workouts recorded yet.</p></div>;

    return (
      <div className="workout-history-page">
        <h1 className="wh-title">Workout History</h1>
        <div className="wh-chart-section">
          <h2 className="wh-chart-heading">Workouts Per Week</h2>
          <ResponsiveContainer width="100%" height={450}>
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
        </div>
      </div>
    );
}
