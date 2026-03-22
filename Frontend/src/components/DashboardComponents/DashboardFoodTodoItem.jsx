import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./DashboardTodo.css";

export function DashboardFoodTodoItem() {
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

  const handleLogFood = () => {
    navigate("/FoodLog");
  };

  return (
    <div className="dashboard-food-container">
      <div className="dashboard-workout-todo-item">
        <div className="dashboard-header">{selectedDateStr}</div>
        <div className="dashboard-task-section">
          <div className="dashboard-cell">
            Plan your meals for today
          </div>
          <div className="dashboard-cell">
            Track breakfast, lunch, dinner, snacks
          </div>
          <div className="dashboard-cell">
            Monitor your daily calorie intake
          </div>
        </div>
        <div className="dashboard-footer">
          <button className="workout-button" onClick={handleLogFood}>
            Log Food!
          </button>
        </div>
      </div>
    </div>
  );
}
