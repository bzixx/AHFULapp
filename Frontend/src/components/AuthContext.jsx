import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Check session on app load
  useEffect(() => {
    // On initial load, check that the Local Stoage Item is still valid and has not expired. 
    //If Expired Require Authentication again

    //POST TO WHO AM I the current Token in Local Storage from the user. 
    

  }, []);

  // Login function - called after Google OAuth success
  const login = async (googleAuthJWT) => {
    try{
        toggleLogLoadingStatus()

        // Login with JWT
        const response = await google_login(googleAuthJWT)
        const user_info = response.user_info;

        setUser(user_info)
        setIsLoggedIn(true)
        toggleLogLoadingStatus()

    }catch (error){
      console.log("LDLAuthContext Error in Login Func Catch.  Not sure how you got here. ")
      toggleLogLoadingStatus()
      console.log("Disabled Loading due to Error" )
    }

  };

  // Logout function
  const logout = () => {
    toggleLogLoadingStatus();
    backend_logout();
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    toggleLogLoadingStatus();
  };

  const toggleLogLoadingStatus = () =>{
    setLogLoading(prev => !prev);
  }

    const toggleIAMLoadingStatus = () =>{
    setIAMLoading(prev => !prev);
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        Logloading,
        IAMloading,
        login,
        logout,
        toggleLogLoadingStatus,
        toggleIAMLoadingStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
