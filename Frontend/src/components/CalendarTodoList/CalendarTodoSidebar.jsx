import { CalendarTodoList } from "./CalendarTodolist";
import "./CalendarTodo.css";

export function CalendarTodoSidebar() {
    return (
        <div className="calendar-todo-sidebar">
            <CalendarTodoList />
        </div>
    );
}