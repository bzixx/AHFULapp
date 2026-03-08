import "./Login.css";
import { GoogleLogin } from "@react-oauth/google";
import { useSelector, useDispatch } from "react-redux";
import { authLogin, authLogout} from "./AuthSlice";


export function Login() {

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    //Check for LocalStorage or Cookie Data.
    const userData = localStorage.getItem("user_data");

    //Define TempText for later use if userData exists
    const tempText = document.getElementById("LoggedInStatus");

    //Define Button for Logout
    const button = document.createElement("button");
    button.innerText = "Logout";
    button.addEventListener("click", () => {handle_google_logout(); tempText.innerText = "Logged out successfully!";});

    // If is NOT Authenticated
    if (!isAuthenticated) {



        //If LocalStorage or Cookie Data exists, parse it and update the LoggedInStatus text to show the user is logged in with their email.
        if (userData) {
            //TODO: Check for Expiry time with WhoAmI Route
            // console.log(userData);
            //Define POST URL for Later
            const backendPOSTURL = `http://localhost:5000/AHFULauth/whoami`;

            //Try to Get LocalStorage Cookie for data
            try{
                // // POST response Object to BACKEND API ROUTE for processing.
                // const backendResponse = await fetch(backendPOSTURL, {
                //     method: 'POST',
                //     headers: {'Content-Type': 'application/json',},
                //     body: JSON.stringify(userData),
                //     credentials: 'include',
                // });
                // if (!backendResponse.ok) {
                //     const message = `AHFUL Frontend API response error (${backendResponse.status}): ${backendResponse.statusText}`;
                //     throw new Error(message);
                // }else{
                //     console.log("AHFUL WhoAmI Check Completed successfully.");
                // }

            }catch(error){
                //Catch Spooky Errors that should never occur because you shouldnt log out before login
                console.log("Front End Local Sotrage/Cookie WhoamI check error , ", error)
            }

            const parsedData = JSON.parse(userData);
            if (parsedData && tempText) {
                tempText.innerText = `Logged in as ${parsedData.email}`;
                tempText.appendChild(button);

            }
            //If Not LocalStorage or Cookie Data
        }else{
            //DO NOTHING, the Google Login Button will be shown and the user can log in.
        }


        //IF Authenticated
    }else {
            
        if (userData) {
            // console.log(userData);
            tempText.appendChild(button);
        }

    }

    // Logout function
    const dispatch = useDispatch();
    const handle_google_logout = async() => {
        //Define POST URL for Later
        const backendPOSTURL = `http://localhost:5000/AHFULauth/logout`;

        //Try to Get LocalStorage Cookie for data
        try{
            let userData = localStorage.getItem("user_data");
            let parsedData = JSON.parse(userData);

            // POST response Object to BACKEND API ROUTE for processing.
            const backendResponse = await fetch(backendPOSTURL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({ logout_email: parsedData.email }),
                credentials: 'include',
            });

            localStorage.removeItem('user_data');
            //TODO: UPDATE REDUX
            //setIsLoggedIn(false);
            dispatch(authLogout());
            console.log("AHFUL Logout Completed successfully.");

        }catch(error){
            //Catch Spooky Errors that should never occur because you shouldnt log out before login
            console.log("👻, ", error)
        }
    };

    const handle_google_success = async (response) => {
        try{
            //URL to send POST to later
            const backendPOSTURL = `http://localhost:5000/AHFULauth/google-login`;

            //Find ID Token, and maybe details from Google Success Response
            const googleButtonIdToken = response?.credential;
            const googleCSFR = response?.g_csrf_token;
            const googleButtonClientID = response?.client_id;

            //Check IDToken Not Null
            if (googleButtonIdToken) {
                // POST response Object to BACKEND API ROUTE for processing.
                const backendResponse = await fetch(backendPOSTURL, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json',},
                    body: JSON.stringify({ token: googleButtonIdToken }),
                    credentials: 'include',
                });
                
                //Explicit check over response from server
                const contentType = backendResponse.headers.get('content-type');
                let backendUserData = null;
                
                //If it exisits and the content type mathces, then set the frontendUserInfo variable
                //Also Sotre it to local Storage
                if (contentType && contentType.includes('application/json')) {
                    backendUserData = await backendResponse.json();
                    const frontendUserInfo = backendUserData.user_info;
                    const userString = JSON.stringify(frontendUserInfo);
                    localStorage.setItem("user_data", userString);
                    dispatch(authLogin(frontendUserInfo));
                    //If we want to swap to https use below line instead.
                    //document.cookie = `user_data=${userString}; path=/; secure; samesite=strict`;
                    document.cookie = `user_data=${userString}; path=/; samesite=strict`;

                } else {
                    //If its not JSON try to parse it into text. 
                    backendUserData = await backendResponse.text();
                }

                //Error Handeling for if Backend Logic reported Failed to Frontend
                if (!backendResponse.ok) {
                    const message = backendUserData?.error || backendResponse.statusText;
                    throw new Error(`AHFUL Frontend API response error (${backendResponse.status}): ${message}`);
                }
            }

            console.log("AHFUL context_login Completed successfully.");

            //UPDATE REDUX
            // setIsLoggedIn(true)

        }catch (error){
        console.log("AHFUL Error in context_login Func Catch.  Not sure how you got here. ")
        console.log("Disabled Loading due to Error" )
    }    
    };

    const handle_google_failure = (error) => {
        console.error("AHFUL Google Button Login failed and returned Error:", error);
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
                        onSuccess={handle_google_success}
                        onError={handle_google_failure}
                    />
                </div>
                <div id="LoggedInStatus">
                </div>
            </div>
        </div>
    );
}