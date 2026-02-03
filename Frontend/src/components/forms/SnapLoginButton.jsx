//Written with Claude.

export default function SnapchatLoginButton(){
//   const { toggleLogLoadingStatus } = useAuth();

  const handleSnapLogin = () => {
    // Replace with your actual Snapchat client ID
    const clientId = '46792cb1-7759-4f13-94f5-090add10d358';
    const redirectUri = encodeURIComponent(`https://localhost:8000/`);
    const challenge = "LogsDoLieActually"
    
    // Generate random state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    // Store state in sessionStorage for verification later
    sessionStorage.setItem('snapchat_oauth_state', state);
    
    // Build Snapchat OAuth URL
    const authUrl = `https://accounts.snapchat.com/accounts/oauth2/auth` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&&scope=https%3A%2F%2Fauth.snapchat.com%2Foauth2%2Fapi%2Fuser.display_name` +
      `&state=${state}` +
      `&code_challenge=${challenge}` + // Placeholder, implement PKCE for security
      `&code_challenge_method=S256`;
    // 
// GET https://accounts.snapchat.com/accounts/oauth2/auth
// ?response_type=code
// &client_id=YOUR_CLIENT_ID
// &redirect_uri=YOUR_REDIRECT_URI
// &scope=https%3A%2F%2Fauth.snapchat.com%2Foauth2%2Fapi%2Fuser.display_name
// %20https%3A%2F%2Fauth.snapchat.com%2Foauth2%2Fapi%2Fuser.bitmoji.avatar
// &state=RANDOM_STRING
// &code_challenge=HASHED_CODE_VERIFIER
// &code_challenge_method=S256
    // toggleLogLoadingStatus();
    
    // Redirect to Snapchat login
    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleSnapLogin}
      className="snapchat-login-btn"
    >
      Login with Snapchat
    </button>
  );
};