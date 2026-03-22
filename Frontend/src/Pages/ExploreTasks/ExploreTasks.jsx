import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./ExploreTasks.css";
import "../../SiteStyles.css";

export function ExploreTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(true);
  const user = useSelector((state) => state.auth.user);

  const getUserId = () => {
    if (user?._id) return user._id;
    try {
      const stored = JSON.parse(localStorage.getItem("user_data"));
      return stored?._id || null;
    } catch { return null; }
  };
  const userId = getUserId();

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "http://localhost:5000/AHFULtasks";
      if (!showAll && userId) {
        url = `http://localhost:5000/AHFULtasks/user/${userId}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        let bodyText = "";
        try {
          bodyText = await res.text();
        } catch (e) {}
        throw new Error(`Server returned ${res.status} ${res.statusText} ${bodyText}`);
      }

      const data = await res.json();
      const sorted = (Array.isArray(data) ? data : [])
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setTasks(sorted);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      const friendly = err && err.name ? `${err.name}: ${err.message}` : String(err);
      setError(friendly || "Unknown error");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [showAll, userId]);

  return (
    <div className="explore-root">
      <header className="explore-header">
        <h1>Explore Tasks</h1>
        <div className="header-controls">
          <div className="toggle-container">
            <button 
              className={`toggle-btn ${showAll ? 'active' : ''}`}
              onClick={() => setShowAll(true)}
            >
              All Tasks
            </button>
            <button 
              className={`toggle-btn ${!showAll ? 'active' : ''}`}
              onClick={() => setShowAll(false)}
              disabled={!userId}
            >
              My Tasks
            </button>
          </div>
          <button onClick={fetchTasks} disabled={loading} className="refresh-btn">
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      <div className="explore-content">
        <div className="explore-left">
          {error && <div className="explore-error">Error: {error}</div>}

          {!error && (
            <div className="exercise-list">
              {loading && tasks.length === 0 ? (
                <div className="explore-loading">Loading tasks…</div>
              ) : tasks.length === 0 ? (
                <div className="explore-empty">
                  {showAll ? "No tasks found." : "No tasks found. Create a task to see it here!"}
                </div>
              ) : (
                tasks.map((task, idx) => {
                  const key = task.id || task._id || task.name || `task-${idx}`;
                  return (
                    <div key={key} className="exercise-item">
                      <div className="exercise-main">
                        <div className="exercise-name">
                          {task.completed && <span style={{marginRight: '8px'}}>✓</span>}
                          {task.name || "Untitled Task"}
                        </div>
                        <div className="exercise-meta">
                          {task.note && <span>{task.note}</span>}
                          {task.dueTime && (
                            <span> • Due: {new Date(task.dueTime * 1000).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="exercise-meta" style={{marginTop: '4px', fontSize: '12px'}}>
                        Created: {task.created_at ? new Date(task.created_at).toLocaleString() : "Unknown"}
                        {task.updated_at && ` • Updated: ${new Date(task.updated_at).toLocaleString()}`}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
