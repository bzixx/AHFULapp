import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import { DashboardFoodTodoList } from "../../components/DashboardComponents/DashboardFoodTodoList";
import { DashboardWorkoutTodoList } from "../../components/DashboardComponents/DashboardWorkoutTodoList";
import { DashboardTaskTodoList } from "../../components/DashboardComponents/DashboardTaskTodoList";
import { WorkoutChart } from "../../components/WorkoutChart/WorkoutChart";
import { TodayFoodChart } from "../../components/TodayFoodChart/TodayFoodChart";
import { CalendarButton } from "../../components/CalendarButton/CalendarButton";
import { StreakCounter } from "../../components/StreakCounter/StreakCounter";
import "../../siteStyles.css";

function ExternalDashboard() {
  const [workoutStreak, setWorkoutStreak] = useState({
    streak: 3,
    loading: true,
  });
  const [foodStreak, setFoodStreak] = useState({ streak: 5, loading: true });
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    setWorkoutStreak({ streak: 3, loading: false });
    setFoodStreak({ streak: 5, loading: false });
  }, []);

  return (
    <div className="dashboard-landing">
      <section className="section">
        <div className="solo-page-container">
          <div className="hero-eyebrow">Now in early access</div>
          <h1>Your Personal Fitness, Built for Habit, Now in One AHFUL App.</h1>
          <p>
            AHFUL unites workout & food tracking, body metrics, AI coaching, and
            a real community — turning miserable routines into amazing progress.
            We say it's AHFUL-ly effective.
          </p>

          {/* Streaks sit directly under the hero content */}
          <div className="streaks-wrapper">
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

          <div>
            <Link to="/Login" className="primary-cta">
              Get Started
            </Link>
            <a href="#features" className="secondary-cta">
              Learn More
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="solo-page-container">
          <div className="label">What AHFUL does</div>
          <div className="section-title">
            Everything your fitness life needs
          </div>
          <div className="section-sub">
            Built so casual members and serious athletes can both get exactly
            what they came for.
          </div>
          <div className="section_grid">
            <div className="section_card">
              <div className="section_icon">📊</div>
              <div className="section_name">Track & Log Anything</div>
              <div className="section_body">
                Log sets, reps, weights, food, measurements and more. See your
                history, spot gaps with an exercise heat map, and watch your
                numbers climb -- all in one place.
              </div>
            </div>
            <div className="section_card">
              <div className="section_icon">🎯</div>
              <div className="section_name">Habit Coach</div>
              <div className="section_body">
                Micro-goals and reminders to keep momentum every day.
              </div>
            </div>
            <div className="section_card">
              <div className="section_icon">🧠</div>
              <div className="section_name">Smart Programs</div>
              <div className="section_body">
                Adaptive plans that respect your schedule and progress.
              </div>
            </div>
            <div className="section_card">
              <div className="section_icon">🏋️</div>
              <div className="section_name">Workout Planning</div>
              <div className="section_body">
                Plan, record, and track your fitness journey with precision.
              </div>
            </div>
            <div className="section_card">
              <div className="section_icon">📍</div>
              <div className="section_name">Gym Discovery</div>
              <div className="section_body">
                Find gyms near you and connect with fitness professionals.
              </div>
            </div>
            <div className="section_card">
              <div className="section_icon">👨‍🏫</div>
              <div className="section_name">Trainer Tools</div>
              <div className="section_body">
                Personal trainers can manage clients and assign workouts.
              </div>
            </div>
            <div className="section_card">
              <div className="section_icon">🔔</div>
              <div className="section_name">Real Time Task Notifications</div>
              <div className="section_body">
                Stay on track with reminders and motivational alerts.
              </div>
            </div>
            <div className="section_card">
              <div className="section_icon">🤖</div>
              <div className="section_name">AI Coaching</div>
              <div className="section_body">
                Get personalized workout and nutrition advice from our AI coach.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="solo-page-container">
          <div className="label">Who it's for</div>
          <div className="section-title">One app, every role</div>
          <div className="section_grid">
            <div className="section_card">
              <div className="section_name">Gym Member & Home Users </div>
              <div className="section_body">
                Private tracking, habit streaks, body metrics, and a
                customizable dashboard for your goals.
              </div>
            </div>
            <div className="section_card">
              <div className="section_name">Personal trainers</div>
              <div className="section_body">
                Manage clients, assign workouts, schedule sessions, and track
                client progress — all in one place.
              </div>
            </div>
            <div className="section_card">
              <div className="section_name">Gym owners</div>
              <div className="section_body">
                Create events, publish workout calendars, and promote your gym
                to AHFUL's growing user base.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="solo-page-container">
          <div className="label">By the numbers</div>
          <div className="section-title">Built to move with you</div>
          <div className="section_grid">
            <div className="section_card">
              <div className="section_name">Two Factor Verification</div>
              <div className="section_body">Account security built in</div>
            </div>
            <div className="section_card">
              <div className="section_name">User Roles</div>
              <div className="section_body">Member, Trainer, Gym Owner, Gym Admins, Developers</div>
            </div>
            <div className="section_card">
              <div className="section_name">Always on</div>
              <div className="section_body">Live notifications & reminders</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="solo-page-container">
          <div className="cta-h2">Ready to build something that sticks?</div>
          <br />
            <Link to="/Login" className="primary-cta">
              Create an account now!
            </Link>
        </div>
      </section>
    </div>
  );
}

function InternalDashboard() {
  const [workoutStreak, setWorkoutStreak] = useState({
    streak: 0,
    loading: true,
  });
  const [foodStreak, setFoodStreak] = useState({ streak: 0, loading: true });
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?._id) {
      const fetchStreaks = async () => {
        try {
          const [workoutRes, foodRes] = await Promise.all([
            fetch(`https://www.ahful.app/api/AHFULworkout/streak/${user._id}`),
            fetch(`https://www.ahful.app/api/AHFULfood/streak/${user._id}`),
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
          <div className="streaks-wrapper">
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
