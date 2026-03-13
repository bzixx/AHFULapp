import "./DashboardTodo.css";
import { DashboardFoodTodoItem } from "./DashboardFoodTodoItem";
/* Not sure if we'll need this yet, just thought it made sense file-wise for modularity */
export function DashboardFoodTodoList() {
    return (
        <div>
            <DashboardFoodTodoItem />
        </div>
    );
}