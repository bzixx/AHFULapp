/**
 * index.jsx
 * AUTHORS: Andrew Vu, AI Generated
 * CREATED: 2025-09-12
 * UPDATED: 2025-11-17
 *
 * index.jsx serves as the entry point for the React application. It initializes React and finds the Root of the users browerser
 * DOM to render the main App component within a StrictMode wrapper for highlighting potential problems in the application.
 * 
 * App.jsx handles the overall application structure, routing, user interaction, and global state management.
 */

//Imports
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Build the root rendering client and render the app
const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
