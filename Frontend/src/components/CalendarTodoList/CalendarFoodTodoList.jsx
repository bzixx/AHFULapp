import "./CalendarTodo.css";
import { CalendarFoodTodoItem } from "./CalendarFoodTodoItem";

export function CalendarFoodTodoList() {
    return (
        <div className="calendar-todo-list">
            <CalendarFoodTodoItem />
        </div>
    );
}