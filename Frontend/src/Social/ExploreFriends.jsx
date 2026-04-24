import React, { useState } from "react";
import "../siteStyles.css";

export function ExploreFriends() {
    const [username, setUsername] = useState("");
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState("");

    const handleAddFriend = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (username.trim() === "") {
            setError("Please enter a username.");
            // popup warning as requested
            window.alert("Please enter a username.");
            return;
        }
        setFriends((prev) => [...prev, username.trim()]);
        setUsername("");
        setError("");
    };

    return (
        <div className="explore-friends" style={{ display: "flex", gap: "2rem", padding: "1rem" }}>
            <div className="add-friend" style={{ flex: 1 }}>
                <h2>Add a Friend</h2>
                <form onSubmit={handleAddFriend}>
                    <label htmlFor="friend-name">Friend's username</label>
                    <input
                        id="friend-name"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        aria-label="Friend username"
                        style={{ display: "block", width: "100%", marginTop: "0.5rem", padding: "0.5rem" }}
                    />
                    <div style={{ marginTop: "0.75rem" }}>
                        <button type="submit">Add Friend</button>
                    </div>
                    {error && (
                        <p className="error" style={{ color: "red", marginTop: "0.5rem" }}>
                            {error}
                        </p>
                    )}
                </form>
            </div>

            <div className="friend-list" style={{ flex: 1 }}>
                <h2>Your Friends</h2>
                {friends.length === 0 ? (
                    <p>No friends added yet.</p>
                ) : (
                    <ul>
                        {friends.map((f, i) => (
                            <li key={i}>{f}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default ExploreFriends;
