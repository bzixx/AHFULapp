import { Navbar } from "./components/navbar/navbar";
import { Outlet } from "react-router-dom";
import { MenuButton } from "./components/MenuButton/MenuButton";
export function Layout() {
    return (
        <>
            <Navbar/>
            <MenuButton/>
            <main style={{ 
                background: "#FFF7F2",
                minHeight: "90vh",
                display: "flex"
             }}>
            <Outlet/>
            {/* Outlet is used to render the child routes on every page listed in the AHFULApp.jsx file in this case our Navbar*/}
            </main>
        </>
    )
}