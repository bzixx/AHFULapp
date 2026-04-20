import { Navbar } from "./components/navbar/navbar";
import { Outlet } from "react-router-dom";
import { Header } from "./components/Header/Header.jsx";
import { Footer } from "./components/Footer/Footer.jsx";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export function Layout() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const theme = useSelector((state) => state.setting.theme);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const closeNav = () => {
        setIsNavOpen(false);
    };

    // Apply theme globally whenever it changes
    useEffect(() => {
        if (theme === "dark") {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [theme]);

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
