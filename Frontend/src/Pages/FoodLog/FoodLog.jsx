//@author Jonathan Torrence

import React, {useState } from "react";
import "./FoodLog.css";
import "../../SiteStyles.css";

export function FoodLog() {
    const [foods, setFoods] = useState([]);
    const [foodName, setFoodName] = useState("");
    const [calories, setCalories] = useState("");
    const [servings, setServings] = useState("1");
    const [mealType, setMealType] = useState("Lunch");
    const [errors, setErrors] = useState("");
    const [timePeriod, setTimePeriod] = useState("daily");
    const [searchTerm, setSearchTerm] = useState("");


    // Filter foods based on search term and meal type
    const filteredFoods = foods.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addFood = (e) => {
        e.preventDefault();
        setErrors("");

        if(!foodName.trim()) {
            setErrors("Please enter a food name");
            return;
        }

        if (!calories.trim() || parseInt(calories) <= 0) {
            setErrors("Please enter a valid calorie amount");
            return;
        }

        if (parseInt(servings) <= 0) {
            setErrors("Please enter a valid number of servings");
            return;
        }

        const newFood = {
            id: Date.now(),
            name: foodName,
            calories: parseInt(calories),
            servings: parseInt(servings),
            totalCalories: parseInt(calories) * parseInt(servings),
            mealType: mealType,
            timestamp: new Date().toLocaleTimeString()
        };

        setFoods([...foods, newFood]);
        setFoodName("");
        setCalories("");
        setServings("1");
        setMealType("Lunch");
    };

    const removeFood = (id) => {
        setFoods(foods.filter(food => food.id !== id));
    };

    const [editingId, setEditingId] = useState(null);
    const [editFood, setEditFood] = useState(null);

    const startEdit = (food) => {
        setEditingId(food.id);
        setEditFood({...food});
        setFoodName(food.name);
        setCalories(food.calories);
        setServings(food.servings);
        setMealType(food.mealType);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditFood(null);
        setFoodName("");
        setCalories("");
        setServings("1");
        setMealType("Lunch");
    };

    const saveEdit = () => {
        const updatedFoods = foods.map(food =>
            food.id === editingId
            ? {
                ...food,
                name: foodName,
                calories: parseInt(calories),
                servings: parseInt(servings),
                mealType: mealType,
                totalCalories: parseInt(calories) * parseInt(servings)
            }
            : food
        );
        setFoods(updatedFoods);
        cancelEdit();
    };


    const totalCalories = foods.reduce((sum, food) => sum + food.totalCalories, 0);

    const getDateRange = () => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        return {startOfWeek, startOfMonth, startOfYear};
    };

    //weeklyTotal

    const weeklyTotal = foods.reduce((sum, food) => {
        const foodDate = new Date(food.id);
        const {startOfWeek} = getDateRange();
        return foodDate >= startOfWeek ? sum + food.totalCalories : sum;
    }, 0);

    const monthlyTotal = foods.reduce((sum, food) => {
        const foodDate = new Date(food.id);
        const {startOfMonth} = getDateRange();
        return foodDate >= startOfMonth ? sum + food.totalCalories : sum;
    }, 0);

    const yearlyTotal = foods.reduce((sum, food) => {
        const foodDate = new Date(food.id);
        const {startOfYear} = getDateRange();
        return foodDate >= startOfYear ? sum + food.totalCalories : sum;
    }, 0);

    // Group foods by meal type
    const groupedFoods = () => {
        const meals = ["Breakfast", "Lunch", "Dinner", "Snack"];
        const grouped = {};

        meals.forEach(meal => {
            grouped[meal] = filteredFoods.filter(food => food.mealType === meal);
        });

        return grouped;
    };

    const mealGroups = groupedFoods();
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
                        {errors && <div className="error-message">{errors}</div>}
                        <div className="form-group">
                            <label htmlFor="mealType">Meal Category</label>
                            <select
                                id="mealType"
                                value={mealType}
                                onChange={(e) => setMealType(e.target.value)}
                                className="meal-select"
                                >
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                                <option value="Snack">Snack</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-add">
                            {editingId ? "Update Food" : "Add Food"}
                        </button>
                        {editingId && <button type="button" className="btn-cancel" onClick={cancelEdit}>Cancel</button>}
                    </form>
                </div>



               {/* Time Period Selector */}
               <div className="time-period-selector">
                <button
                    className={`period-btn ${timePeriod === 'daily' ? 'active' : ''}`}
                    onClick={() => setTimePeriod('daily')}
                >
                    Daily
                </button>
                <button
                    className={`period-btn ${timePeriod === 'weekly' ? 'active' : ''}`}
                    onClick={() => setTimePeriod('weekly')}
                >
                    Weekly
                </button>
                <button
                    className={`period-btn ${timePeriod === 'monthly' ? 'active' : ''}`}
                    onClick={() => setTimePeriod('monthly')}
                >
                    Monthly
                </button>
                <button
                    className={`period-btn ${timePeriod === 'yearly' ? 'active' : ''}`}
                    onClick={() => setTimePeriod('yearly')}
                    >
                        Yearly
                    </button>
                </div>

                {/* Nutrition Summary */}
                <div className="daily-summary">
                    <h2>
                        {timePeriod === 'daily' && 'Daily Summary'}
                        {timePeriod === 'weekly' && 'Weekly Summary'}
                        {timePeriod === 'monthly' && 'Monthly Summary'}
                        {timePeriod === 'yearly' && 'Yearly Summary'}
                    </h2>

                    <div className="calorie-totals">
                      <div className="total-display">
                        <span className="label">Total Calories:</span>
                        <span className="value">
                            {timePeriod === 'daily' && totalCalories}
                            {timePeriod === 'weekly' && weeklyTotal}
                            {timePeriod === 'monthly' && monthlyTotal}
                            {timePeriod === 'yearly' && yearlyTotal}
                        </span>
                      </div>
                    </div>

                    </div>
                    <div className="food-count">
                        <span className="label">Items Logged:</span>
                        <span className="value">{foods.length}</span>
                    </div>
                </div>



        {/* Logged Foods List */}
        <div className="logged-foods-section">
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search foods..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <h2>Today's Logged Foods</h2>
            {filteredFoods.length === 0 ? (
                <p className="empty-message">No foods logged yet. Start by adding a food item!</p>
            ) : (
                <div className="foods-list">
                    {["Breakfast", "Lunch", "Dinner", "Snack"].map((meal) => (
                        mealGroups[meal].length > 0 && (
                        <div key={meal} className="meal-section">
                            <h3 className="meal-header">{meal}</h3>
                            <div className="meal-items">
                            {mealGroups[meal].map((food) => (
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
                                className="btn-edit"
                                onClick={() => startEdit(food)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn-remove"
                                onClick={() => removeFood(food.id)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>
                        )
                    ))}
                </div>
            )}
        </div>
        </div>
    );
}

