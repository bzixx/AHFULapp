//@Author Jonathan Torrence
import React, { useState, useEffect } from "react";
import "./MeasurementLogger.css";
import "../../SiteStyles.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function MeasurementLogger() {
    const [measurements, setMeasurements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        chest: "",
        waist: "",
        hips: "",
        thighs: "",
        arms: "",
        weight: "",
        date: new Date().toISOString().split('T')[0]
    });
    const [errors, setErrors] = useState("");
    const [editingId, setEditingId] = useState(null);

    const measurements_to_track = [
        {key: "chest", label: "Chest (inches)"},
        {key: "waist", label: "Waist (inches)"},
        {key: "hips", label: "Hips (inches)"},
        {key: "thighs", label: "Thighs (inches)"},
        {key: "arms", label: "Arms (inches)"},
        {key: "weight", label: "Weight (lbs)"}
    ];

    // Load measurements on component mount
    useEffect(() => {
        fetchMeasurements();
    }, []);

    const fetchMeasurements = async () => {
        try {
            setLoading(true);
            const userEmail = localStorage.getItem("userEmail"); // Get from auth
            const response = await fetch(`/AHFULmeasurements/${userEmail}`);

            if (!response.ok) {
                throw new Error("Failed to fetch measurements");
            }

            const data = await response.json();
            setMeasurements(data || []);
        } catch (error) {
            console.error("Error fetching measurements:", error);
            setErrors("Failed to load measurements");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleAddMeasurement = async (e) => {
        e.preventDefault();
        setErrors("");

        // Basic validation
        if (!formData.date) {
            setErrors("Please select a date.");
            return;
        }

        const hasAtLeastOne = measurements_to_track.some(m => formData[m.key].trim());
        if (!hasAtLeastOne) {
            setErrors("Please enter at least one measurement");
            return;
        }

        try {
            setLoading(true);
            const userEmail = localStorage.getItem("userEmail");

            const payload = {
                userEmail,
                ...formData,
                date: new Date(formData.date).toISOString()
            };

            const endpoint = editingId
                ? `/AHFULmeasurements/${editingId}`
                : '/AHFULmeasurements';

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to save measurement");
            }

            // Refresh measurements
            await fetchMeasurements();

            // Reset form
            setFormData({
                chest: "",
                waist: "",
                hips: "",
                thighs: "",
                arms: "",
                weight: "",
                date: new Date().toISOString().split('T')[0]
            });
            setEditingId(null);
            setErrors("");
        } catch (error) {
            console.error("Error saving measurement:", error);
            setErrors("Failed to save measurement: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditMeasurement = (measurement) => {
        setFormData({
            chest: measurement.chest || "",
            waist: measurement.waist || "",
            hips: measurement.hips || "",
            thighs: measurement.thighs || "",
            arms: measurement.arms || "",
            weight: measurement.weight || "",
            date: measurement.date.split('T')[0]
        });
        setEditingId(measurement._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteMeasurement = async (id) => {
        if (window.confirm("Are you sure you want to delete this measurement?")) {
            try {
                setLoading(true);
                const response = await fetch(`/AHFULmeasurements/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error("Failed to delete measurement");
                }

                await fetchMeasurements();
            } catch (error) {
                console.error("Error deleting measurement:", error);
                setErrors("Failed to delete measurement");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            chest: "",
            waist: "",
            hips: "",
            thighs: "",
            arms: "",
            weight: "",
            date: new Date().toISOString().split('T')[0]
        });
    };

    // Prepare chart data
    const chartData = measurements.map(m => ({
        date: new Date(m.date).toLocaleDateString(),
        chest: m.chest ? parseFloat(m.chest) : null,
        waist: m.waist ? parseFloat(m.waist) : null,
        hips: m.hips ? parseFloat(m.hips) : null,
        thighs: m.thighs ? parseFloat(m.thighs) : null,
        arms: m.arms ? parseFloat(m.arms) : null,
        weight: m.weight ? parseFloat(m.weight) : null
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="measurement-container">
            <h1>Measurement Logger</h1>

            <div className="measurement-content">
                {/* Add/Edit Measurement Form */}
                <div className="add-measurement-section">
                    <h2>{editingId ? "Edit Measurement" : "Log New Measurements"}</h2>
                    {errors && <div className="error-message">{errors}</div>}

                    <form onSubmit={handleAddMeasurement} className="measurement-form">
                        <div className="form-group">
                            <label htmlFor="date">Date</label>
                            <input
                                id="date"
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>

                        {measurements_to_track.map(measurement => (
                            <div key={measurement.key} className="form-group">
                                <label htmlFor={measurement.key}>{measurement.label}</label>
                                <input
                                    id={measurement.key}
                                    type="number"
                                    name={measurement.key}
                                    step="0.1"
                                    value={formData[measurement.key]}
                                    onChange={handleInputChange}
                                    placeholder={`Enter ${measurement.label.toLowerCase()}`}
                                    disabled={loading}
                                />
                            </div>
                        ))}

                        <div className="form-buttons">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : editingId ? "Update Measurement" : "Add Measurement"}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancelEdit}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Charts Section */}
                {chartData.length > 0 && (
                    <div className="charts-section">
                        <h2>Measurement Trends</h2>

                        {/* Weight Chart */}
                        {chartData.some(d => d.weight) && (
                            <div className="chart-container">
                                <h3>Weight Progress</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (lbs)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Body Measurements Chart */}
                        {chartData.some(d => d.chest || d.waist || d.hips || d.arms || d.thighs) && (
                            <div className="chart-container">
                                <h3>Body Measurements Progress</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="chest" stroke="#82ca9d" name="Chest (in)" />
                                        <Line type="monotone" dataKey="waist" stroke="#ffc658" name="Waist (in)" />
                                        <Line type="monotone" dataKey="hips" stroke="#ff7c7c" name="Hips (in)" />
                                        <Line type="monotone" dataKey="arms" stroke="#8dd1e1" name="Arms (in)" />
                                        <Line type="monotone" dataKey="thighs" stroke="#d084d0" name="Thighs (in)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                )}

                {/* Measurement History */}
                <div className="measurement-history">
                    <h2>Measurement History</h2>
                    {loading && <p>Loading...</p>}
                    {measurements.length === 0 && !loading && <p>No measurements recorded yet. Add your first measurement above!</p>}

                    {measurements.length > 0 && (
                        <div className="measurements-list">
                            {measurements.slice().reverse().map(measurement => (
                                <div key={measurement._id} className="measurement-card">
                                    <div className="measurement-date">
                                        {new Date(measurement.date).toLocaleDateString()}
                                    </div>
                                    <div className="measurement-values">
                                        {measurement.weight && <p><strong>Weight:</strong> {measurement.weight} lbs</p>}
                                        {measurement.chest && <p><strong>Chest:</strong> {measurement.chest}"</p>}
                                        {measurement.waist && <p><strong>Waist:</strong> {measurement.waist}"</p>}
                                        {measurement.hips && <p><strong>Hips:</strong> {measurement.hips}"</p>}
                                        {measurement.arms && <p><strong>Arms:</strong> {measurement.arms}"</p>}
                                        {measurement.thighs && <p><strong>Thighs:</strong> {measurement.thighs}"</p>}
                                    </div>
                                    <div className="measurement-actions">
                                        <button
                                            className="btn btn-edit"
                                            onClick={() => handleEditMeasurement(measurement)}
                                            disabled={loading}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-delete"
                                            onClick={() => handleDeleteMeasurement(measurement._id)}
                                            disabled={loading}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
