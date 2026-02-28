import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AHFULAuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Check session on app load
  useEffect(() => {
    // On initial load, check that the Local Stoage Item is still valid and has not expired.
    try{
        let userData = localStorage.getItem("user_data");
        let parsedData = JSON.parse(userData);
        let cookieGoesStaleAt = 0;

        if(parsedData){
            cookieGoesStaleAt = parsedData.last_login_expire;

        }

        let currTime = Math.floor(Date.now() / 1000);        

        if (currTime > cookieGoesStaleAt){
            localStorage.removeItem("user_data");

        }else{
          setIsLoggedIn(true);
        }

    }catch(error){
        console.log("Re-AuthNeeded? : ", error);
    }

    //If Expired Require Authentication again
    //POST TO WHO AM I the current Token in Local Storage from the user.
    //This Is Taken Care of in Backend Check as well :)
    //Front End handles logic to remove from local stoage if found to be expired. 
  }, [location]);

  // context_login function - called after Google OAuth success
  const context_login = async (response) => {
    try{
        //URL to send POST to later
        const backendPOSTURL = `http://localhost:5000/sign-in/google-login`;

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
                localStorage.setItem("user_data", JSON.stringify(frontendUserInfo));

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

         setIsLoggedIn(true)

    }catch (error){
      console.log("AHFUL Error in context_login Func Catch.  Not sure how you got here. ")
      console.log("Disabled Loading due to Error" )
    }
  };

  // Logout function
  const context_logout = async() => {
    //Define POST URL for Later
    const backendPOSTURL = `http://localhost:5000/sign-in/logout`;

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
        setIsLoggedIn(false);


      }catch(error){
        //Catch Spooky Errors that should never occur because you shouldnt log out before login
        console.log("👻, ", error)
      }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        context_login,
        context_logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context from within nested App Context
export const use_ahful_auth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('use_ahful_auth must be used within AHFULAuthProvider');
  }
  return context;
};
