import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./DashboardTodo.css";

export function DashboardFoodTodoItem() {
  /* Redux call to see if a date is selected, if not use current date */
  const selectedDate = useSelector((state) => state.calendar.selectedDate);
  /* Format the date for header. Defaults to current date if no date is selected, and US layout if we can't get one from browser */
  const locale = navigator.language || "en-US";
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  /* Format the selected date or current date for display in header */
  const selectedDateStr = selectedDate
    ? dateFormatter.format(new Date(selectedDate))
    : dateFormatter.format(new Date());

  const navigate = useNavigate();

  const handleLogFood = () => {
    navigate("/FoodLog");
  };

  /* The structure is similar to the workout todo item, but with different tasks and button text. */
  return (
    <div className="dashboard-food-container">
      <div className="dashboard-workout-todo-item">
        {/* Header */}
        <div className="dashboard-header">{selectedDateStr}</div>
        {/* Task section */}
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
        {/* Footer */}
        <div className="dashboard-footer">
          <button className="workout-button" onClick={handleLogFood}>
            Log Food!
          </button>
        </div>
      </div>
    </div>
  );
}