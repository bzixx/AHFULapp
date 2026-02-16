import { Navbar } from "./Components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
    
export function Layout() {
    return (
        <>
            <Navbar minHeight = "5vh"/>
            <main style={{ 
                background: "linear-gradient(0deg, #30364F, #3cb6b6)",
                minHeight: "95vh",
                display: "flex"
             }}>
            <Outlet/>
            {/* Outlet is used to render the child routes on every page listed in the AHFULApp.jsx file in this case our Navbar*/}
            </main>
        </>
    )
}