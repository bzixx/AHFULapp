import { addAWSCred } from '../../services/awsCredsApi';
import { useState } from 'react';
import { useAuth } from '../functions/LDLAuthContext';
import { threatMappingApi } from '../../services/threatMappingApi';


export default function NewAWSCredentialsForm({setShowNewForm, setAWSCredsFound, setAWSCredsInDBList}) {

    const { user } = useAuth();

  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [nickName, setNickName] = useState("");
  const [region, setRegion] = useState('us-east-1'); // Default AWS region

  async function handleSubmit(e) {
    e.preventDefault();

    // Only proceed if all fields are filled
    if (accessKey && secretKey && nickName && region) {
      try {
        // First, create a timestamp for consistency
        const timestamp = new Date().toISOString();

        // Store the credentials and get the response
        const response = await addAWSCred({
            accessKey,
            secretKey,
            nickName,
            region,
            created_at: timestamp
        })

        if (!response) {
          alert(`Failed to save credentials: as unknown response came back.`);
          console.error('Failed to save credentials. This is what the reponse was: ', response);
          return;
        }

        // Clear the form
        console.log('Credentials saved successfully:', response);

        // Clear the form first
        setAccessKey('');
        setSecretKey('');
        setNickName('');
        setRegion('us-east-1');
        setShowNewForm(false);

        // Use the API service to refresh credentials list (ensures consistency)
        if (user?.display_name) {
          threatMappingApi.getAWSCredsFromDB(user.display_name, setAWSCredsFound, setAWSCredsInDBList);
        }

        alert('AWS credentials saved successfully!');
      } catch (err) {
        console.error('Failed to save credentials:', err);
        alert(`Error: ${err.message}`);
      }
    }
  }
  
  return (
    <form className="aws-form" onSubmit={handleSubmit} 
    style={{ padding: '16px', backgroundColor: '#1c2128', borderRadius: '6px', border: '1px solid #30363d' }}>
      <div className="form-group">
        <label className="form-label">
          Nickname:
          <input type="text" value={nickName} onChange={(e) => setNickName(e.target.value)} required className="form-input" />
        </label>
      </div>
      <div className="form-group">
        <label className="form-label">
          Access Key:
          <input type="text" value={accessKey} onChange={(e) => setAccessKey(e.target.value)} required className="form-input" />
        </label>
      </div>
      <div className="form-group">
        <label className="form-label">
          Secret Key:
          <input type="password" value={secretKey} onChange={(e) => setSecretKey(e.target.value)} required className="form-input"/>
        </label>
      </div>
      <div className="form-group">
        <label className="form-label">
          AWS Region:
          <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g., us-east-1" required className="form-input"
          />
          <div className="form-help">
            Enter the AWS region identifier (e.g., us-east-1, eu-west-1)
          </div>
        </label>
      </div>
      <button type="submit" className="btn btn-success">
        Save New Credentials
      </button>
    </form>
  )

}