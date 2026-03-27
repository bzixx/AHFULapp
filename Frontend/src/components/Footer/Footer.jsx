import "./Footer.css"

export function Footer(){

    return(
        <footer className="gym-footer">
            <div>© {new Date().getFullYear()} AHFUL — A Helpful Fitness Utilization Logger, Built for better habits</div>
        </footer>
    )
}