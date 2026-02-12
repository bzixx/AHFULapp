import { Navbar } from "./Components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
    
export function Layout() {
    return (
        <>
            <Navbar/>
            <main style={{ paddingTop: "90px" }}>
                <Outlet/>
            </main>
        </>
    )
}