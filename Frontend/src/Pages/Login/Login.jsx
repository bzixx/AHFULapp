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

    const handleGoogleSuccess = async (response) => {
        //URL to send POST to later
        const backendPOSTURL = `http://localhost:5000/sign-in/google-login`;

        //Find ID Token from Google Success Response
        const googleButtonIdToken = response?.credential;

        //Check IDToken Not Null
        if (googleButtonIdToken) {
            // POST response Object to BACKEND API ROUTE
            const backendResponse = await fetch(backendPOSTURL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({ token: googleButtonIdToken }),
                credentials: 'include',
            });

            //Get User_info From BACKEND response to cache cookie
            const frontendUserInfo = backendResponse.user_info;

            //TODO SetUser or Cache Cookie or use hook or Create Session
            //setUser(frontendUserInfo)
            
            const contentType = backendResponse.headers.get('content-type');
            let backendUserData = null;
            
            if (contentType && contentType.includes('application/json')) {
                backendUserData = await backendResponse.json();
            } else {
                backendUserData = await backendResponse.text();
            }

            if (!backendResponse.ok) {
                const message = backendUserData?.error || backendResponse.statusText;
                throw new Error(`AHFUL Frontend API response error (${backendResponse.status}): ${message}`);
            }

            return backendUserData;
        }

        console.error("AHFUL Login failed");
    };

    const handleGoogleFailure = (error) => {
        console.error("AHFUL Google Login failed:", error);
    };

    //TODO
    // async function logout() {
    //     const url = `${API_BASE_URL}/logout`;
    //     const res = await fetch(url, {
    //         method: 'POST',
    //         credentials: 'include',
    //     });
    //     return handleResponse(res)
    // }

    // async function whoami() {
    //     const url = `${API_BASE_URL}/whoami`;
    //     const res = await fetch(url, {
    //         method: 'GET',
    //         credentials: 'include'
    //     });
    //     return handleResponse(res);
    // }

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
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure}>AHFUL Google Login</GoogleLogin>
            </div>
        </div>
    );
}