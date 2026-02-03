import { useAuth } from "../functions/LDLAuthContext";
import { Link } from "react-router-dom";

import CustomLDLLogin from "../forms/CustomLDLLogin";
import LoadingPage from '../pages/LoadingPage';
import SessionCard from "../displays/SessionCard";
import "../../siteStyles.css";

export default function LoginPage() {
  // Single source of truth from AuthContext
  const { isLoggedIn, Logloading } = useAuth();

  if (Logloading) {
    return (
      <LoadingPage />
    );
  }

  return (
    <div className="app-center">
      {isLoggedIn ? (
        <div className="card">
          <div className="grid">
            <SessionCard />
            <div className="aws-creds-prompt">
              <h2>AWS Credentials</h2>
              <p>Manage your AWS credentials and run IAM analysis</p>
              <Link
                to="/aws-credentials"
                className="btn btn-success"
              >
                Manage AWS Credentials
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <CustomLDLLogin />
        </div>
      )}
    </div>
  );
}
