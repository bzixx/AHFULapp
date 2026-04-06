import { Navbar } from "./components/navbar/navbar";
import { Outlet } from "react-router-dom";
import { MenuButton } from "./components/MenuButton/MenuButton";
import { Header } from "./components/Header/Header.jsx";
import { Footer } from "./components/Footer/Footer.jsx";

export function Layout() {
    
    return (
        <>
            {/*Getting rid of this until I add a mobile view
            <MenuButton/>
            */}
            <main>
            <Navbar />
            <div className="page-content">
                <Header />
                <Outlet />
                <Footer />
            </div>
            </main>
        </>
    )
}