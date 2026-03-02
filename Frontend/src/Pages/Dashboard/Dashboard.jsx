import React from "react";
import "./Dashboard.css";
import { DashboardFoodTodoList } from "../../Components/DashboardComponents/DashboardComponentsTodo/DashboardFoodTodoList";
import { DashboardWorkoutTodoList } from "../../Components/DashboardComponents/DashboardComponentsTodo/DashboardWorkoutTodoList";
import { CalendarButton } from "../../Components/CalendarButton/CalendarButton";
import { HeatMap } from "../../Components/HeatMap/HeatMap";
import "../../SiteStyles.css";

export function Dashboard() {
  /// This is the main dashboard page that will display the heatmap, calendar button, and to-do lists for food and workouts.
    return <>
        <HeatMap />
        <CalendarButton />
        <DashboardFoodTodoList />
        <DashboardWorkoutTodoList />
    </>;
}