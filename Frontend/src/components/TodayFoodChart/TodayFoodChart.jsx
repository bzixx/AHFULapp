import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./TodayFoodChart.css";

const API_BASE = "http://localhost:5000/AHFULfood";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

export function TodayFoodChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    fetchTodayFood();
  }, []);

  function fetchTodayFood() {
    try {
      const userData = JSON.parse(localStorage.getItem("user_data"));
      if (!userData?._id) {
        setLoading(false);
        return;
      }

      fetch(`${API_BASE}/${userData._id}`)
        .then(async (res) => {
          if (!res.ok) return [];
          return res.json();
        })
        .then((foods) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayTimestamp = Math.floor(today.getTime() / 1000);

          const todayFoods = foods.filter((food) => {
            const foodTime = food.time;
            return foodTime >= todayTimestamp;
          });

          const meals = ["Breakfast", "Lunch", "Dinner", "Snack"];
          const chartData = meals
            .map((meal) => {
              const mealFoods = todayFoods.filter((f) => f.type === meal);
              const calories = mealFoods.reduce(
                (sum, f) => sum + f.calsPerServing * f.servings,
                0
              );
              return { name: meal, calories };
            })
            .filter((d) => d.calories > 0);

          setData(chartData);
          setTotalCalories(chartData.reduce((sum, d) => sum + d.calories, 0));
        })
        .catch((err) => {
          console.error("Failed to load food data:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="today-food-chart"><p>Loading...</p></div>;
  }

  if (data.length === 0) {
    return (
      <div className="today-food-chart">
        <h3>Today's Calories</h3>
        <p className="empty-message">No foods logged today</p>
        <p className="total-calories">0 cal</p>
      </div>
    );
  }

  return (
    <div className="today-food-chart">
      <h3>Today's Calories</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="calories"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} cal`} />
        </PieChart>
      </ResponsiveContainer>
      <p className="total-calories">{totalCalories} cal total</p>
    </div>
  );
}
