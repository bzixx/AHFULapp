import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../siteStyles.css";

import { useAuth } from "../functions/LDLAuthContext";


export default function LoadingPage() {
  // Single source of truth from AuthContext
  const { IAMloading, Logloading } = useAuth();
  const [TempLoadingbeforeForwardOption, setTempLoadingbeforeForwardOption] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
        setTempLoadingbeforeForwardOption(false);
    }, 15000);
    
    return () => clearTimeout(timer);
}, []); 

  if (Logloading == true) {
    return (
      <div className="app-center">
        <div className="card">
          <div style={{ padding: '40px', textAlign: 'center' }}>
              <div>
                <h2>Loading...</h2>
                <div className="loader"></div>

              </div>


            <div className="aws-status-label">
              Please wait while the Minions get us Coffee.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (IAMloading == true) {
    return (
      <div className="app-center">
        <div className="card">
          <div style={{ padding: '40px', textAlign: 'center' }}>
              <div>
                <h2>Loading...</h2>
                <div className="loader"></div>

              </div>


            <div className="aws-status-label">AWS IAM Check is currently: <span style={{color: IAMloading ? 'red' : 'green', fontWeight:700}}>{IAMloading ? 'Running...' : 'Completed!'}</span></div>

              <Link 
                to="/threat-mapping" 
                className="button primary"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: '#238636',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  marginTop: '16px'
                }}
              >
                {TempLoadingbeforeForwardOption ? 'Please wait...' : 'Go To Threat Mapping Page'}
              </Link>

              

          </div>
        </div>
      </div>
    );
  }

  
}
