import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { DashboardFoodTodoList } from "../../Components/DashboardComponents/DashboardFoodTodoList";
import { DashboardWorkoutTodoList } from "../../Components/DashboardComponents/DashboardWorkoutTodoList";
import { WorkoutChart } from "../../Components/WorkoutChart/WorkoutChart";
import { TodayFoodChart } from "../../Components/TodayFoodChart/TodayFoodChart";
import { CalendarButton } from "../../Components/CalendarButton/CalendarButton";
import "../../SiteStyles.css";

function ExternalDashboard() {
  return (
    <div className="dashboard-landing">
      <section className="hero">
        <div className="hero-content">
          <h1>Personal fitness tracking, built for habit.</h1>
          <p className="lead">
            AHFUL helps you build lasting habits with simple tracking, smart
            coaching, and a community that keeps you moving.
          </p>

          <div className="hero-actions">
            <Link to="/Login" className="primary-cta">Get Started</Link>
            <a href="#features" className="secondary-cta">Learn More</a>
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
            <div className="feature-icon">📊</div>
            <h3>Track Anything</h3>
            <p>Log workouts, measurements, meals, and moods — all in one place.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎯</div>
            <h3>Habit Coach</h3>
            <p>Micro-goals and reminders to keep momentum every day.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🧠</div>
            <h3>Smart Programs</h3>
            <p>Adaptive plans that respect your schedule and progress.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🏋️</div>
            <h3>Workout Planning</h3>
            <p>Plan, record, and track your fitness journey with precision.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📍</div>
            <h3>Gym Discovery</h3>
            <p>Find gyms near you and connect with fitness professionals.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">👨‍🏫</div>
            <h3>Trainer Tools</h3>
            <p>Personal trainers can manage clients and assign workouts.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔔</div>
            <h3>Live Notifications</h3>
            <p>Stay on track with reminders and motivational alerts.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🤖</div>
            <h3>AI Planning</h3>
            <p>AI-powered workout suggestions and fitness research partner.</p>
          </div>
        </div>
      </section>

      <footer className="gym-footer">
        <div>© {new Date().getFullYear()} AHFUL — Built for better habits</div>
        <div className="footer-links"></div>
      </footer>
    </div>
  );
}

function InternalDashboard() {
  return (
    <div className="dashboard-internal">
      <div className="dashboard-grid">
        <div className="dashboard-main-content">
          <CalendarButton />
          <div className="dashboard-tasks-row">
            <DashboardFoodTodoList />
            <DashboardWorkoutTodoList />
          </div>
        </div>
        <div className="dashboard-side-content">
          <TodayFoodChart />
          <WorkoutChart defaultWeeks={6} />
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? <InternalDashboard /> : <ExternalDashboard />;
}
