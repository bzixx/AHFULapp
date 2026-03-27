import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { DashboardFoodTodoList } from "../../Components/DashboardComponents/DashboardFoodTodoList";
import { DashboardWorkoutTodoList } from "../../Components/DashboardComponents/DashboardWorkoutTodoList";
import { DashboardTaskTodoList } from "../../Components/DashboardComponents/DashboardTaskTodoList";
import { WorkoutChart } from "../../Components/WorkoutChart/WorkoutChart";
import { TodayFoodChart } from "../../Components/TodayFoodChart/TodayFoodChart";
import { CalendarButton } from "../../Components/CalendarButton/CalendarButton";
import { StreakCounter } from "../../Components/StreakCounter/StreakCounter";
import "../../SiteStyles.css";

function ExternalDashboard() {
  const [workoutStreak, setWorkoutStreak] = useState({ streak: 3, loading: true });
  const [foodStreak, setFoodStreak] = useState({ streak: 5, loading: true });
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
      setWorkoutStreak({ streak: 3, loading: false });
      setFoodStreak({ streak: 5, loading: false });
  }, []);

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
          <div className="streaks-container">
            <StreakCounter
              count={workoutStreak.streak}
              type="workout"
              loading={workoutStreak.loading}
            />
            <StreakCounter
              count={foodStreak.streak}
              type="food"
              loading={foodStreak.loading}
            />
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
        <div>© {new Date().getFullYear()} AHFUL — A Helpful Fitness Utilization Logger, Built for better habits</div>
        <div className="footer-links"></div>
      </footer>
    </div>
  );
}

function InternalDashboard() {
  const [workoutStreak, setWorkoutStreak] = useState({ streak: 0, loading: true });
  const [foodStreak, setFoodStreak] = useState({ streak: 0, loading: true });
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?._id) {
      const fetchStreaks = async () => {
        try {
          const [workoutRes, foodRes] = await Promise.all([
            fetch(`http://localhost:5000/AHFULworkout/streak/${user._id}`),
            fetch(`http://localhost:5000/AHFULfood/streak/${user._id}`)
          ]);

          const workoutData = await workoutRes.json();
          const foodData = await foodRes.json();

          setWorkoutStreak({ streak: workoutData.streak || 0, loading: false });
          setFoodStreak({ streak: foodData.streak || 0, loading: false });
        } catch (error) {
          console.error("Error fetching streaks:", error);
          setWorkoutStreak({ streak: 0, loading: false });
          setFoodStreak({ streak: 0, loading: false });
        }
      };
      fetchStreaks();
    }
  }, [user?._id]);

  return (
    <div className="dashboard-internal">
      <div className="dashboard-grid">
        <div className="dashboard-main-content">
          <div className="internal-streaks">
            <StreakCounter
              count={workoutStreak.streak}
              type="workout"
              loading={workoutStreak.loading}
            />
            <StreakCounter
              count={foodStreak.streak}
              type="food"
              loading={foodStreak.loading}
            />
          </div>
          <CalendarButton />
          <div className="dashboard-tasks-row">
            <DashboardFoodTodoList />
            <DashboardWorkoutTodoList />
          </div>
          <div className="dashboard-tasks-row">
            <DashboardTaskTodoList />
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
