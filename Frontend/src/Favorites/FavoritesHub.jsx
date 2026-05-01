import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./FavoritesHub.css";
import "../siteStyles.css";
import { getFoodFavorites, getWorkoutFavorites, getTaskFavorites, createWorkout } from "../QueryFunctions";

export function FavoritesHub() {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("foods"); // foods, workouts, tasks

  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [favoriteWorkouts, setFavoriteWorkouts] = useState([]);
  const [favoriteTasks, setFavoriteTasks] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUserId = () => {
    if (user?._id) return user._id;
    try {
      const stored = JSON.parse(localStorage.getItem("user_data"));
      return stored?._id || null;
    } catch {
      return null;
    }
  };

  const userId = getUserId();

  useEffect(() => {
    if (!userId) return;
    fetchFavorites();
  }, [userId]);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const [foodRes, workoutRes, taskRes] = await Promise.all([
        getFoodFavorites(userId),
        getWorkoutFavorites(userId),
        getTaskFavorites(userId),
      ]);

      if (foodRes.data) {
        setFavoriteFoods(Array.isArray(foodRes.data) ? foodRes.data : []);
      }
      if (workoutRes.data) {
        setFavoriteWorkouts(Array.isArray(workoutRes.data) ? workoutRes.data : []);
      }
      if (taskRes.data) {
        setFavoriteTasks(Array.isArray(taskRes.data) ? taskRes.data : []);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const addFavoriteFoodToLog = async (food) => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const res = await fetch(`https://www.ahful.app/api/AHFULfoods/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: food.name,
          calsPerServing: food.calsPerServing,
          servings: food.servings,
          type: food.type,
          time: now,
        }),
      });

      if (res.ok) {
        alert(`✅ Added "${food.name}" to today's food log!`);
      } else {
        alert("Failed to add food");
      }
    } catch (err) {
      console.error("Error adding food:", err);
      alert("Error adding food to log");
    }
  };

  const addFavoriteWorkoutToToday = async (workout) => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const res = await fetch(`https://www.ahful.app/api/AHFULworkouts/create/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          title: `${workout.title} (from favorites)`,
          startTime: now,
          endTime: now,
          gymId: workout.gymId || null,
          exercises: workout.exercises || [],
          template: false,
        }),
      });

      if (res.ok) {
        alert(`✅ Added "${workout.title}" to today's workouts!`);
      } else {
        alert("Failed to add workout");
      }
    } catch (err) {
      console.error("Error adding workout:", err);
      alert("Error adding workout");
    }
  };

  const addFavoriteTaskToList = async (task) => {
    try {
      const res = await fetch(`https://www.ahful.app/api/AHFULtasks/create/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: task.name,
          note: task.note,
          dueTime: Math.floor(Date.now() / 1000) + 86400, // Due tomorrow
          recurring: task.recurring || false,
          recurrenceType: task.recurrenceType || null,
          recurrenceEndDate: task.recurrenceEndDate || null,
        }),
      });

      if (res.ok) {
        alert(`✅ Added "${task.name}" to your tasks!`);
      } else {
        alert("Failed to add task");
      }
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Error adding task");
    }
  };

  return (
    <div className="favorites-hub">
      <div className="favorites-header">
        <h1>⭐ My Favorites</h1>
        <button className="refresh-btn" onClick={fetchFavorites} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="favorites-tabs">
        <button
          className={`tab-btn ${activeTab === "foods" ? "active" : ""}`}
          onClick={() => setActiveTab("foods")}
        >
          🍎 Foods ({favoriteFoods.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "workouts" ? "active" : ""}`}
          onClick={() => setActiveTab("workouts")}
        >
          💪 Workouts ({favoriteWorkouts.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "tasks" ? "active" : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          ✓ Tasks ({favoriteTasks.length})
        </button>
      </div>

      <div className="favorites-content">
        {/* Foods Tab */}
        {activeTab === "foods" && (
          <div className="tab-content">
            {favoriteFoods.length === 0 ? (
              <div className="empty-state">
                <p>No favorite foods yet</p>
                <small>Star foods from your food log to add them here</small>
              </div>
            ) : (
              <div className="favorites-list">
                {favoriteFoods.map((food) => (
                  <div key={food._id} className="favorite-item">
                    <div className="favorite-info">
                      <h3>{food.name}</h3>
                      <p className="food-meta">
                        {food.calsPerServing} cal/serving × {food.servings} servings = {food.calsPerServing * food.servings} cal
                      </p>
                      <span className="food-type">{food.type}</span>
                    </div>
                    <button
                      className="quick-add-btn"
                      onClick={() => addFavoriteFoodToLog(food)}
                      title="Add this food to today's log"
                    >
                      + Add Today
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Workouts Tab */}
        {activeTab === "workouts" && (
          <div className="tab-content">
            {favoriteWorkouts.length === 0 ? (
              <div className="empty-state">
                <p>No favorite workouts yet</p>
                <small>Star workouts from your workout logger to add them here</small>
              </div>
            ) : (
              <div className="favorites-list">
                {favoriteWorkouts.map((workout) => (
                  <div key={workout._id} className="favorite-item">
                    <div className="favorite-info">
                      <h3>{workout.title}</h3>
                      {workout.exercises && Array.isArray(workout.exercises) && (
                        <p className="exercise-count">
                          {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    <button
                      className="quick-add-btn"
                      onClick={() => addFavoriteWorkoutToToday(workout)}
                      title="Add this workout to today"
                    >
                      + Add Today
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="tab-content">
            {favoriteTasks.length === 0 ? (
              <div className="empty-state">
                <p>No favorite tasks yet</p>
                <small>Star tasks from your task list to add them here</small>
              </div>
            ) : (
              <div className="favorites-list">
                {favoriteTasks.map((task) => (
                  <div key={task._id} className="favorite-item">
                    <div className="favorite-info">
                      <h3>{task.name}</h3>
                      {task.note && <p className="task-note">{task.note}</p>}
                      {task.recurring && (
                        <span className="recurring-badge">🔄 Repeats {task.recurrenceType}</span>
                      )}
                    </div>
                    <button
                      className="quick-add-btn"
                      onClick={() => addFavoriteTaskToList(task)}
                      title="Add this task to your list"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
