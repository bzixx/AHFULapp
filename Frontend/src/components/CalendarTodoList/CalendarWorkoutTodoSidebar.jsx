import { CalendarWorkoutTodoList } from "./CalendarWorkoutTodoList";
import "./CalendarTodo.css";

export function CalendarWorkoutTodoSidebar() {
    return (
        <div className="calendar-todo-sidebar">
            <CalendarWorkoutTodoList />
        </div>
    );
}