import React from "react";
import "./Home.css";
import "../../SiteStyles.css";
import { Calendar } from "../../Components/Calendar/Calendar";
export function Home() {
    return <>
    <div>Welcome to the home page!</div>
    <Calendar />
    </>;
}