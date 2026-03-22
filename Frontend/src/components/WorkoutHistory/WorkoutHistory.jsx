import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import "./WorkoutHistory.css";

export function WorkoutHistory() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAndAggregateWorkouts();
  }, []);

  function getWeekInfo(date) {
    const d = new Date(date);
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - (day - 1));
    const month = d.toLocaleString("default", { month: "short" });
    const label = `${month} ${d.getDate()}`;
    const sortKey = d.toISOString().slice(0, 10);
    return { label, sortKey };
  }

  async function fetchAndAggregateWorkouts() {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user_data"));

      if (!userData?._id) {
        setWeeklyData([]);
        setLoading(false);
        return;
      }

      const res = await fetch(
        `http://localhost:5000/Backend/AHFULworkout/${encodeURIComponent(userData._id)}`
      );
      if (!res.ok) throw new Error("Failed to fetch workouts");
      const workouts = await res.json();

      if (!workouts || workouts.length === 0) {
        setWeeklyData([]);
        setLoading(false);
        return;
      }
      const buckets = {};
      workouts.forEach((w) => {
        const { label, sortKey } = getWeekInfo(w.startTime);
        if (!buckets[sortKey]) buckets[sortKey] = { week: label, count: 0 };
        buckets[sortKey].count += 1;
      });
      const aggregated = Object.entries(buckets)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([, { week, count }]) => ({ week, workouts: count }));
      setWeeklyData(aggregated.slice(-6));
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="workout-history-widget"><p>Loading...</p></div>;
  if (error) return <div className="workout-history-widget"><p className="wh-error">{error}</p></div>;
  if (weeklyData.length === 0) {
    return (
      <div className="workout-history-widget">
        <h3>Workout History</h3>
        <p className="empty-message">No workouts recorded yet</p>
      </div>
    );
  }

  return (
    <div className="workout-history-widget">
      <h3>Workouts This Month</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11 }}
            tickLine={false}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="workouts" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
