import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./DashboardTodo.css";

export function DashboardWorkoutTodoItem() {
  const selectedDate = useSelector((state) => state.calendar.selectedDate);
  const locale = navigator.language || "en-US";
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const selectedDateStr = selectedDate
    ? dateFormatter.format(new Date(selectedDate))
    : dateFormatter.format(new Date());

  const navigate = useNavigate();

  const handleStartWorkout = () => {
    navigate("/WorkoutLogger");
  };

  return (
    <div className="dashboard-workout-container">
      <div className="dashboard-workout-todo-item">
        <div className="dashboard-header">{selectedDateStr}</div>
        <div className="dashboard-task-section">
          <div className="dashboard-cell">
            Schedule your workout for today
          </div>
          <div className="dashboard-cell">
            Log completed exercises
          </div>
          <div className="dashboard-cell">
            Track your progress over time
          </div>
        </div>
        <div className="dashboard-footer">
          <button className="workout-button" onClick={handleStartWorkout}>
            Start Workout!
          </button>
        </div>
      </div>
    </div>
  );
}
