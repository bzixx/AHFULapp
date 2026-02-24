import React from "react";
import "./Home.css";
import "../../SiteStyles.css";
import { CalendarTodoSidebar } from "../../Components/CalendarTodoList/CalendarTodoSidebar.jsx";
import { Calendar } from "../../Components/Calendar/Calendar.jsx";
export function Home() {
    return <>
        <CalendarTodoSidebar />
        <Calendar />
    </>;
}