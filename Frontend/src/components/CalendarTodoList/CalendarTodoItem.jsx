import "./CalendarTodo.css";

export function CalendarTodoItem() {
  return (
    <div>
      <table>
        <tr>
          <th class="calendar-cell-header">Temp Date </th>
        </tr>
        <tr>
          <td class="calendar-cell">Temp Task</td>
        </tr>
      </table>
      <button class="workout-button" onclick={() => alert("Workout started!")}>Start Workout</button>
    </div>
  );
}