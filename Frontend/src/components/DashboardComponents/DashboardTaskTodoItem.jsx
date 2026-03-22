import "./DashboardTodo.css";

export function DashboardTaskTodoItem({ task }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatDueDate = (timestamp) => {
    if (!timestamp || timestamp === 0) return "No due date";
    try {
      return new Date(timestamp * 1000).toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className={`dashboard-todo-item ${task.completed ? 'task-completed' : ''}`}>
      <div className="dashboard-todo-item-main">
        <span className="dashboard-todo-item-title">{task.name || "Untitled Task"}</span>
        {task.completed && <span className="task-status-badge">✓</span>}
      </div>
      {task.note && (
        <div className="dashboard-todo-item-meta">{task.note}</div>
      )}
      <div className="dashboard-todo-item-sub">
        <span>Due: {formatDueDate(task.dueTime)}</span>
        <span className="dashboard-todo-item-date">{formatDate(task.created_at)}</span>
      </div>
    </div>
  );
}
