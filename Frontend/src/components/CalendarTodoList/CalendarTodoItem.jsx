import { useSelector } from "react-redux";
import "./CalendarTodo.css";

export function CalendarTodoItem() {
  const selectedDate = useSelector((state) => state.calendar.selectedDate);

  return (
    <div>
      <table>
        <tr>
          <th class="calendar-cell-header">{selectedDate} </th>
        </tr>
        <tr>
          <td class="calendar-cell">Temp Task</td>
        </tr>
      </table>
      <button class="workout-button" onclick={() => alert("Workout started!")}>Start Workout</button>
    </div>
  );
}