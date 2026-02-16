import { Navbar } from "./components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { MenuButton } from "./components/MenuButton/MenuButton";
export function Layout() {
    return (
        <>
            <Navbar/>
            <MenuButton/>
            <Outlet/>
            {/* Outlet is used to render the child routes on every page listed in the AHFULApp.jsx file in this case our Navbar*/}
        </>
    )
}