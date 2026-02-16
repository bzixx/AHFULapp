import { Navbar } from "./Components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
    
export function Layout() {
    return (
        <>
            <Navbar/>
            <main style={{ paddingTop: "90px" }}>
            <Outlet/>
            {/* Outlet is used to render the child routes on every page listed in the AHFULApp.jsx file in this case our Navbar*/}
            </main>
        </>
    )
}