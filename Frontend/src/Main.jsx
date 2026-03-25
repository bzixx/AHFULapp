import React from 'react'
import ReactDOM from 'react-dom/client'
import AHFULApp from './AHFULApp.jsx'
import './SiteStyles.css'
import { StoreProvider } from './Store.jsx'
import { BrowserRouter as Router } from "react-router-dom";
import { useAuthInit } from './hooks/useAuthInit';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Loading } from './components/Loading/Loading.jsx';

function AppWithAuth() {
  const { loading } = useAuthInit();
  
  if (loading) {
    return <Loading message="Restoring session..." />;
  }
  
  return <AHFULApp />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StoreProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Router>
          <AppWithAuth />
        </Router>
      </GoogleOAuthProvider>
    </StoreProvider>
  </React.StrictMode>,
)
