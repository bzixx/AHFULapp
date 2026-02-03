//Custom Google Login Componment which lives on the session page when the user is NOT logged in.
//It uses the @react-oauth/google package to handle the Google OAuth flow.
//It takes in two props, loginFunction and sessionFunction.
//loginFunction is a function that sets the login state of the user, it is passed in from LoginPage.
//sessionFunction is a function that sets the session state of the user, it is passed in from LoginPage.
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from '../functions/LDLAuthContext';
import SnapchatLoginButton from "./SnapLoginButton";

export default function CustomLDLLogin() {
  // Get login function from AuthContext
  const { login } = useAuth();

  const handleGoogleSuccess = async (response) => {
    const idToken = response?.credential;
    if (idToken) {
        // Single function call - handles everything
        await login(idToken);
        return;
    }
    console.error("Login failed");
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login failed:", error);
  };

  return (
        <div className="card" style={{maxWidth:520}}>
        <div className="header">
          <div className="logo-badge">TM</div>
          <div>
            <div className="title">Threat Mapping Console</div>
            <div className="subtitle">Secure AWS credential management · Sign in to continue</div>
          </div>
        </div>

        <div className="section" style={{marginTop:12}}>
          <h2 style={{margin:'0 0 8px 0'}}>Sign in</h2>
          <p className="small-muted">Use your Google account to sign in and manage sessions.</p>
          <div style={{marginTop:18}}>
           <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
           <p>Or</p>
           <SnapchatLoginButton/>
          </div>
        </div>
      </div>
  );
}