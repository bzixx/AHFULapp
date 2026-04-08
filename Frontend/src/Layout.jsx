import { Navbar } from "./components/navbar/navbar";
import { Outlet } from "react-router-dom";
import { MenuButton } from "./components/MenuButton/MenuButton";
import { Header } from "./components/Header/Header.jsx";
import { Footer } from "./components/Footer/Footer.jsx";
import { useState } from "react";

export function Layout() {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const closeNav = () => {
        setIsNavOpen(false);
    };

    return (
        <>
            {/*Getting rid of this until I add a mobile view
            <MenuButton/>
            */}
            <main>
            <Header onMenuToggle={toggleNav} isMenuOpen={isNavOpen} />
            <Navbar isOpen={isNavOpen} onNavClick={closeNav} />
            <div className="page-content">
                <Outlet />
                <Footer />
            </div>
            </main>
        </>
    )
}