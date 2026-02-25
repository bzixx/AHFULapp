import "./CalendarTodo.css";
import { CalendarWorkoutTodoItem } from "./CalendarWorkoutTodoItem";

export function CalendarWorkoutTodoList() {
    return (
        <div className="calendar-todo-list">
            <CalendarWorkoutTodoItem />
        </div>
    );
}