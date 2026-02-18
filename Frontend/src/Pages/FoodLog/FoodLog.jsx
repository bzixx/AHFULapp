import React, {useState } from "react";
import "./FoodLog.css";
import "../../SiteStyles.css";

export function FoodLog() {
    const [foods, setFoods] = useState([]);
    const [foodName, setFoodName] = useState("");
    const [calories, setCalories] = useState("");
    const [servings, setServings] = useState("1");

    const addFood = (e) => {
        e.preventDefault();

        if (!foodName.trim() || !calories.trim()) {
            alert("Please fill in all fields.");
            return;
        }

        const newFood = {
            id: Date.now(),
            name: foodName,
            calories: parseInt(calories),
            servings: parseInt(servings),
            totalCalories: parseInt(calories) * parseInt(servings),
            timestamp: new Date().toLocaleTimeString()
        };

        setFoods([...foods, newFood]);
        setFoodName("");
        setCalories("");
        setServings("1");
    };

    const removeFood = (id) => {
        setFoods(foods.filter(food => food.id !== id));
    };

    const totalCalories = foods.reduce((sum, food) => sum + food.totalCalories, 0);

    return (
        <div className="food-log-container">
            <h1>Food Log</h1>

            <div className="food-log-content">
                {/* Add Food Form */}
                <div className="add-food-section">
                    <h2>Log New Food</h2>
                    <form onSubmit={addFood} className="food-form">
                        <div className="form-group">
                            <label htmlFor="foodName"> Food Name </label>
                            <input
                                id="foodName"
                                type="text"
                                placeholder="e.g., Apple, Chicken Breast"
                                value={foodName}
                                onChange={(e) => setFoodName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="calories"> Calories per Serving </label>
                            <input
                                id="calories"
                                type="number"
                                placeholder="e.g., 95"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="servings"> Servings </label>
                            <input
                                id="servings"
                                type="number"
                                placeholder="1"
                                min="1"
                                value={servings}
                                onChange={(e) => setServings(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-add">Add Food</button>
                    </form>
                </div>

                {/* Daily Summary */}
                <div className="daily-summary">
                    <h2>Daily Summary</h2>
                    <div className="total-calories">
                        <span className="label">Total Calories:</span>
                        <span className="value">{totalCalories}</span>
                </div>
                <div className="food-count">
                    <span className="label">Items Logged:</span>
                    <span className="value">{foods.length}</span>
                </div>
            </div>
        </div>

        {/* Logged Foods List */}
        <div className="logged-foods-section">
            <h2>Today's Logged Foods</h2>
            {foods.length === 0 ? (
                <p className="empty-message">No foods logged yet. Start by adding a food item!</p>
            ) : (
                <div className="foods-list">
                    {foods.map((food) => (
                        <div key={food.id} className="food-item">
                            <div className="food-details">
                                <h3>{food.name}</h3>
                                <p className="food-meta">
                                    {food.servings} serving{food.servings > 1 ? "s" : ""} x {food.calories} cal/serving
                                </p>
                            </div>
                            <div className="food-info">
                                <span className="calories-badge">{food.totalCalories} cal</span>
                                <span className="time-badge">{food.timestamp}</span>
                            </div>
                            <button
                                className="btn-remove"
                                onClick={() => removeFood(food.id)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
   </div>
    );
}
