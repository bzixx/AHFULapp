import { Navbar } from "./components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { MenuButton } from "./components/MenuButton/MenuButton";
export function Layout() {
    return (
        <>
            <Navbar/>
            <MenuButton/>
            <main style={{ 
                background: "linear-gradient(0deg, #30364F, #3cb6b6)",
                minHeight: "90vh",
                display: "flex"
             }}>
            <Outlet/>
            {/* Outlet is used to render the child routes on every page listed in the AHFULApp.jsx file in this case our Navbar*/}
            </main>
        </>
    )
}