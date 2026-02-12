/**
 * AwsCredentialsSelectorPage - Dedicated page for AWS credentials management
 *
 * This component provides a centralized interface for:
 * - Selecting from saved AWS credentials
 * - Adding new AWS credentials
 * - Running IAM permission checks
 * - Managing AWS connection status
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../functions/LDLAuthContext';
import { threatMappingApi } from '../../services/threatMappingApi';
import LoadingPage from './LoadingPage';
import '../../siteStyles.css';
import NewAWSCredentialsForm from '../forms/NewAWSCredentialsForm';
import AWSCredsList from '../forms/AWSCredsList';

const AwsCredentialsSelectorPage = () => {
  const { user, IAMloading, toggleIAMLoadingStatus} = useAuth();
  const [AWSCredsinDBList, setAWSCredsInDBList] = useState([]);
  const [AWSCredsFound, setAWSCredsFound] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  // State for multiple credential selection
  const [allSelectedCredentials, setAllSelectedCredentials] = useState([]);

  // State for filtering AWS-managed roles
  const [excludeAWSManagedRoles, setExcludeAWSManagedRoles] = useState(true);

  useEffect(() => {
    // Fetch user sessions when the component mounts or when sessions change
    if (threatMappingApi.getAWSCredsFromDB && user?.display_name) {
      threatMappingApi.getAWSCredsFromDB(user.display_name, setAWSCredsFound, setAWSCredsInDBList);
    }
  }, [user]);

  // Handle IAM permission check
  const handleIAMCheck = async () => {
    toggleIAMLoadingStatus();
    // Get the selected credential details
      try {
        await threatMappingApi.checkIAMPermissions(allSelectedCredentials, {
          excludeAWSManagedRoles: excludeAWSManagedRoles
        });

      } catch (err) {
        console.warn(`Check failed to complete IAM Check with all selected creds. Error Message Reads:`, err);
      }
  };


  return (
    <div className="app-center">
      <div className="card">

        <div className="header">
          <div className="logo-badge">AWS</div>
          <div>
            <div className="title">AWS Credentials Manager</div>
            <div className="subtitle">Select or add AWS credentials for threat mapping</div>
          </div>
        </div>

        {/* New Credentials Button */}
        <div className="iam-check-section">
          <button  onClick={() => setShowNewForm(true)}  className="btn btn-success">
            ➕ Add New Credentials
          </button>
        </div>

        {(IAMloading) ? <LoadingPage /> :

        <div className="aws-credentials-container">
          <div className="title" style={{marginBottom: 16}}>
            AWS Credentials
          </div>


          {/* Credentials Selector Dropdown */}

          <div className="credentials-selector" style={{marginBottom: 24}}>

            <label style={{display: 'block', marginBottom: 8}}>
                Select AWS Credentials (Multiple):
            </label>

            <AWSCredsList AWSCredsFound={AWSCredsFound} setAWSCredsFound={setAWSCredsFound} AWSCredsinDBList={AWSCredsinDBList} setAWSCredsInDBList={setAWSCredsInDBList} allSelectedCredentials={allSelectedCredentials} setAllSelectedCredentials={setAllSelectedCredentials}/>

            {/* Filter AWS Managed Roles Checkbox */}
            <div style={{ marginTop: '16px', marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={excludeAWSManagedRoles}
                  onChange={(e) => setExcludeAWSManagedRoles(e.target.checked)}
                  style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span>Filter out AWS-managed roles (recommended)</span>
              </label>
              <p style={{ fontSize: '12px', color: '#8b949e', marginTop: '4px', marginLeft: '26px' }}>
                Excludes service-linked roles like AWSServiceRoleForSupport, OrganizationAccountAccessRole, etc.
              </p>
            </div>

            {/* Run IAM Check Button -- Required Inline CSS for Pointer Update */}
            <button onClick={handleIAMCheck} className="iam-check-button" disabled={allSelectedCredentials.length === 0 || IAMloading} aria-label="Run analysis of IAM roles and permissions"
              style={{
                opacity: allSelectedCredentials.length === 0 ? 0.5 : 1,
                cursor: allSelectedCredentials.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Run IAM Roles Analyzer
            </button>

          </div>

          {/* Selected Credentials Details */}
          {allSelectedCredentials.length > 0 && !showNewForm && (
            <div className="selected-credentials" style={{ padding: '16px', backgroundColor: '#1c2128', borderRadius: '6px', border: '1px solid #30363d', marginBottom: '20px' }}>
              <h3 style={{marginBottom: '16px', color: '#e6edf3'}}>Selected Credentials</h3>
              {allSelectedCredentials.map(credId => {
                const cred = AWSCredsinDBList.find(c => c._id === credId);
                return cred && (
                  <div key={cred._id} style={{ padding: '12px', backgroundColor: '#161b22', borderRadius: '4px', marginBottom: '8px'}}>
                    <div style={{marginBottom: '8px'}}>
                      <strong>Profile Name:</strong> {cred.nickName}
                    </div>
                    <div style={{marginBottom: '8px'}}>
                      <strong>Access Key:</strong>
                      <span style={{fontFamily: 'monospace'}}>{threatMappingApi.formatAccessKey(cred.accessKey)}</span>
                    </div>
                    <div style={{marginBottom: '8px'}}>
                      <strong>Created:</strong> {new Date(cred.created_at).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* New Credentials Form Pop-up */}
          {(showNewForm) && (
            <NewAWSCredentialsForm setShowNewForm={setShowNewForm} setAWSCredsFound={setAWSCredsFound} setAWSCredsInDBList={setAWSCredsInDBList}/>

          )}

        </div>
        }


      </div>
    </div>
  );
};

export default AwsCredentialsSelectorPage;
