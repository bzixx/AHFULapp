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
        {/* Header */}
        <div className="dashboard-header">{selectedDateStr}</div>

        {/* Scrollable tasks */}
        <div className="dashboard-task-section">
          <table>
            <tbody>
              {Array.from({ length: 70 }, (_, i) => (
                <tr key={i}>
                  <td className="dashboard-cell">Food Task {i + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer button */}
        <div className="dashboard-footer">
          <button className="workout-button" onClick={handleLogFood}>
            Log Food!
          </button>
        </div>
      </div>
    </div>
  );
}