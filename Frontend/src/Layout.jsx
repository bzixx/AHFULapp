import { Navbar } from "./navbar.jsx";
import { Outlet } from "react-router-dom";
import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";
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
            <main>
            <Header onMenuToggle={toggleNav} isMenuOpen={isNavOpen} onNavClick={closeNav} />
            <Navbar isOpen={isNavOpen} onNavClick={closeNav} />
            <div className="page-content">
                <Outlet />
                <Footer />
            </div>
            </main>
        </>
    )
}
