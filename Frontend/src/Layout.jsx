import { Navbar } from "./components/navbar/navbar";
import { Outlet } from "react-router-dom";
import { MenuButton } from "./components/MenuButton/MenuButton";

export function Layout() {
    
    return (
        <>
            {/*Getting rid of this until I add a mobile view
            <MenuButton/>
            */}
            <main>
            <Navbar/>

            <Outlet/>
            {/* Outlet is used to render the child routes on every page listed in the AHFULApp.jsx file in this case our Navbar*/}
            </main>
        </>
    )
}