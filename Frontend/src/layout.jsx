import { Navbar } from "./components/navbar/navbar";
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