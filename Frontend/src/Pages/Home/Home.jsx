import React from "react";
import "./Home.css";
import "../../SiteStyles.css";
export function Home() {
    return (
        <main className="gym-landing-root home-root">

        <section className="hero">
            <div className="hero-content">
            <h1>Personal fitness tracking, built for habit.</h1>
            <p className="lead">
                AHFUL helps you build lasting habits with simple tracking, smart
                coaching, and a community that keeps you moving.
            </p>

            <div className="hero-actions">
                <a className="primary-cta" href="#get-started">Start Free</a>
                <a className="secondary-cta" href="#features">Learn More</a>
            </div>
            </div>

            <div className="hero-visual">
            <div className="mock-device">
                <div className="mock-screen">
                <div className="stat-row">
                    <div>
                    <div className="stat">+3</div>
                    <div className="stat-label">Streak</div>
                    </div>
                    <div>
                    <div className="stat">72%</div>
                    <div className="stat-label">Consistency</div>
                    </div>
                    <div>
                    <div className="stat">5</div>
                    <div className="stat-label">Programs</div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>

        <section id="features" className="features">
            <h2>Features</h2>
            <div className="features-grid">
            <div className="feature">
                <h3>Track Anything</h3>
                <p>Log workouts, measurements, meals, and moods — all in one place.</p>
            </div>
            <div className="feature">
                <h3>Habit Coach</h3>
                <p>Micro-goals and reminders to keep momentum every day.</p>
            </div>
            <div className="feature">
                <h3>Smart Programs</h3>
                <p>Adaptive plans that respect your schedule and progress.</p>
            </div>
            </div>
        </section>

        <footer className="gym-footer">
            <div>© {new Date().getFullYear()} AHFUL — Built for better habits</div>
            <div className="footer-links">
            </div>
        </footer>
        </main>
    )
}