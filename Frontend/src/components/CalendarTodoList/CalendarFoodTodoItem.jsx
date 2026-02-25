import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./CalendarTodo.css";

export function CalendarFoodTodoItem() {
  const selectedDate = useSelector((state) => state.calendar.selectedDate);
  const locale = navigator.language || "en-US";
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const todaysDate = new Date();

  const selectedDateStr = selectedDate ? 
  dateFormatter.format(new Date(selectedDate))
  : "No date selected";

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th className="calendar-cell-header">{selectedDateStr}</th>
          </tr>
          <tr>
            <td className="calendar-cell">Temp Task</td>
          </tr>
        </tbody>
      </table>

      <Link to="/FoodLog" className="workout-button">
      Log Food!
      </Link>
    </div>
  );
}