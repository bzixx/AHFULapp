import React from "react";
import "./Dashboard.css";
import { DashboardFoodTodo } from "../../components/Dashboard/DashboardFoodTodo";
import { DashboardWorkoutTodo } from "../../components/Dashboard/DashboardWorkoutTodo";
import "../../SiteStyles.css";
export function Home() {
    return <>
        <DashboardFoodTodo />
        <DashboardWorkoutTodo />
    </>;
}