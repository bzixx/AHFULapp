/**
 * App.jsx
 * AUTHORS: Andrew Vu, Ethan Birbley, AuGust Ringelstetter, AI Generated
 * CREATED: 2025-09-12
 * UPDATED: 2025-11-17
 *
 * index.jsx serves as the entry point for the React application. It initializes React and finds the Root of the users browerser
 * DOM to render the main App component within a StrictMode wrapper for highlighting potential problems in the application.
 * 
 * App.jsx handles the overall application structure, routing, user interaction, and global state management.
 */

import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'

// Handles initialization of the Google Login
import { GoogleOAuthProvider } from "@react-oauth/google";

// Components
import Navigation from "./components/pages/Navigation";
import { useAuth } from './components/functions/LDLAuthContext';

// The pages of the app (used with router)
import LoginPage from "./components/pages/LoginPage";
import LoadingPage from "./components/pages/LoadingPage";
import ThreatMappingPage from "./components/pages/ThreatMappingPage";
import AwsCredentialsSelectorPage from "./components/pages/AwsCredentialsSelectorPage";
import { AuthProvider } from './components/functions/LDLAuthContext';

// Styles
import './siteStyles.css';

// Layout component with navigation
const Layout = () => {
  const {isLoggedIn} = useAuth()
  return (
    <div className="app-layout">
      {isLoggedIn && <Navigation />}
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

/**
 * The main App component
 * It provide the google OAuth context and does page routing.
 */
export default function App() {

  // Define the routes for the app
  // Each route maps a path to a Page component
  // The Root Path is defined as the LoginPage component, that is how the uer is introduced to the app and the login screen.
  const routes = [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <LoginPage/>,
        },
        {
          path: 'aws-credentials',
          element: <AwsCredentialsSelectorPage/>,
        },
        {
          path: 'threat-mapping',
          element: <ThreatMappingPage/>,
        }
      ]
    }
  ]

  const router = createBrowserRouter(routes)

  //Returns the Page router and declares the default router to use.
  //See Routes above for all the pages in the app.
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
