import React, { useState } from "react";
import "../siteStyles.css";

export function ExploreFriends() {
    // local-only state (no backend calls here)
    const [inputValue, setInputValue] = useState("");
    const [pendingRequests, setPendingRequests] = useState([]); // list of emails
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState("");

    const handleAddFriend = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const email = (inputValue || "").trim();
        if (email === "") {
            setError("Please enter an email address.");
            window.alert("Please enter an email address.");
            return;
        }

        // Basic dedupe: don't add if already pending or already a friend
        const normalized = email.toLowerCase();
        if (pendingRequests.includes(normalized) || friends.includes(normalized)) {
            setError("That user is already pending or a friend.");
            window.alert("That user is already pending or a friend.");
            return;
        }

        setPendingRequests((prev) => [...prev, normalized]);
        setInputValue("");
        setError("");
    };

    const handleAccept = (email) => {
        const normalized = email.toLowerCase();
        setPendingRequests((prev) => prev.filter((e) => e !== normalized));
        setFriends((prev) => [...prev, normalized]);
    };

    const handleCancelPending = (email) => {
        const normalized = email.toLowerCase();
        setPendingRequests((prev) => prev.filter((e) => e !== normalized));
    };

    const handleRemoveFriend = (email) => {
        const normalized = email.toLowerCase();
        setFriends((prev) => prev.filter((e) => e !== normalized));
    };

    return (
        <div style={{ padding: "1rem" }}>
            {/* Add friend hbox at top */}
            <div
                className="add-friend-hbox"
                style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "1rem" }}
            >
                <label htmlFor="friend-email" style={{ minWidth: "110px" }}>
                    Add friend by email
                </label>
                <input
                    id="friend-email"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="friend@example.com"
                    aria-label="Friend email"
                    style={{ flex: 1, padding: "0.5rem" }}
                />
                <button onClick={handleAddFriend} aria-label="Send friend request">
                    Send Request
                </button>
            </div>

            {error && (
                <p className="error" style={{ color: "red", marginBottom: "1rem" }}>
                    {error}
                </p>
            )}

            {/* Pending requests in a 3-column grid */}
            <section style={{ marginBottom: "1.5rem" }}>
                <h2>Pending Friend Requests</h2>
                {pendingRequests.length === 0 ? (
                    <p>No pending friend requests.</p>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "1rem",
                        }}
                    >
                        {pendingRequests.map((p) => (
                            <div
                                key={p}
                                className="pending-card"
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "0.75rem",
                                    borderRadius: "6px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem",
                                }}
                            >
                                <div style={{ fontWeight: 600 }}>{p}</div>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button onClick={() => handleAccept(p)}>Accept</button>
                                    <button onClick={() => handleCancelPending(p)}>Cancel</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Current friends list */}
            <section>
                <h2>Your Friends</h2>
                {friends.length === 0 ? (
                    <p>You have no friends yet.</p>
                ) : (
                    <div style={{ display: "grid", gap: "0.5rem" }}>
                        {friends.map((f) => (
                            <div
                                key={f}
                                style={{
                                    border: "1px solid #eee",
                                    padding: "0.5rem",
                                    borderRadius: "6px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div>{f}</div>
                                <div>
                                    <button onClick={() => handleRemoveFriend(f)}>Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default ExploreFriends;
