import "./Login.css";
import { use_ahful_auth } from './AuthContext.jsx';
import { GoogleLogin } from "@react-oauth/google";



export function Login() {

    const {isLoggedIn, context_login } = use_ahful_auth();

    const handleGoogleSuccess = async (response) => {
        context_login(response)

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
                <div className="login-button">
                    <GoogleLogin 
                        size="large"
                        width="200"
                        text="signin_with"
                        theme="filled_black" 
                        shape="pill"
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                    />
                </div>
            </div>
        </div>
    );
}