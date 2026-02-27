import "./DashboardTodo.css";
import { DashboardWorkoutTodoItem } from "./DashboardWorkoutTodoItem";
/* Not sure if we'll need this yet, just thought it made sense file-wise for modularity */
export function DashboardWorkoutTodoList() {
    return (
        <div>
            <DashboardWorkoutTodoItem />
        </div>
    );
}