import { CalendarFoodTodoList } from "./CalendarFoodTodoList";
import "./CalendarTodo.css";

export function CalendarFoodTodoSidebar() {
    return (
        <div className="calendar-todo-sidebar">
            <CalendarFoodTodoList />
        </div>
    );
}