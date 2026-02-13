import { Navbar } from "./Components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
    
export function Layout() {
    return (
        <>
            <Navbar height = "90px"/>
            <main style={{ 
                background: "#535353",
                minHeight: "calc(100vh - 90px)",
                display: "flex"
             }}>
            <Outlet/>
            {/* Outlet is used to render the child routes on every page listed in the AHFULApp.jsx file in this case our Navbar*/}
            </main>
        </>
    )
}