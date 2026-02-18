import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import "../../SiteStyles.css";

export function Login() {
    // Variables
    const navigate = useNavigate();

    // Functions
    function goHome(){
        navigate("/");
    }

    return (
        <div className = "login-page">
            <div className = "login-card">
                <div className = "login-title">
                    <h1>'AHFUL'</h1>
                    <p>(A Helpful Fitness Utilization Logger)</p>
                </div>
                <div>
                    <h3>
                    An 'AHFUL' app is your one-stop shop for everything you need in a fitness logger.
                    </h3>
                    
                    <ul>
                    <li>Record workouts</li>
                    <li>Save templates</li>
                    <li>Schedule future workouts on a calendar</li>
                    <li>Track food nutrition, etc.</li>
                    </ul>

                    <h3>
                    To use this 'AHFUL' app, you'll need to sign in with your Google account below.
                    </h3>
                </div>
                <div className = "login-button">
                    <GoogleLogin size="large" width="200" text="signin_with" theme="filled_black" shape="pill" />
                </div>
            </div>
        </div>
    );
}