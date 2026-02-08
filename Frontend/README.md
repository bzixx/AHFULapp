## AHFUL Application -- Frontend Technical Documentation

This directory holds all information required for the Frontend to render and load for the user.  
Key components:
All Navigation Pages for the user
Custom Auth Context component for persistent authentication

### Frontend Directory Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── displays/                           # React Visualization components (Shows content)
│   │   │   ├── AWSCredsList.jsx                # Lists all saved AWS credentials for current user 
│   │   │   ├── SessionCard.jsx                 # Displays the information of the currently logged in user session.
│   │   |   └── graph/                          # Main Graph Page components folder
│   │   │       ├── GraphFilter.jsx             # Switch for enabling Filtering and Basic Email submission setup. 
│   │   │       └── ThreatMappingPageD3.jsx     # Map generation, management, & display
|   |   | 
│   │   ├── forms/                              # React Form components (Contain Submit Button)
│   │   │   └── CustomLDLLogin.jsx           # Custom component for Google Sign-In integration
|   |   | 
|   |   │── functions/                          # React Function components (Not visually shown in to user)
│   │   │   └── LDLAuthContext.jsx           #Function for Global Auth Context
|   |   |   
│   │   └── pages/                              # React Page components (Base page componets to show)
│   │       ├── AwsCredentialsSelectorPage.jsx  # AWS credentials selector form to select the desired creds and run IAM check
│   │       ├── LoadingPage.jsx                 # Loading Page that is displayed whenever the program is laoding
│   │       ├── LoginPage.jsx                   # Login Page is the inital landing page of the website
│   │       ├── Navigation.jsx                  # Nav Bar for the Website, shown on all pages.
│   │       └── ThreatMappingPage.jsx           # Main Threat Mapping page to display graphical results of previous scans.
|   |   
│   ├── services/                               # Frontend API services
│   │   └── threatMappingApi.js                 # Frontend API client file to allow backend communication.
|   |   
│   ├── AHFULApp.jsx                                 # Main application with router & DOM rendering
│   ├── main.jsx                               # Entry point, gets bundled to dist/
│   └── siteStyles.css                          # Site CSS File.  Provides Styling for the enitre project
|  
├── dist/                                     # Static assets and build output
│   ├── assets/ 
│   └── index.html                             #Static Assets
|       (Other files will be generated here for JS and CSS from react.)
|
├── node_modules/                                     # Node assets and build output
│   └── misc                                        #Node Assets
|
├── biome.json                                  # Code formatting configuration
├── index.html                              # Main HTML file for the application
├── package.json                                # Dependencies and build scripts
├── package-lock.json                                # Dependencies and build scripts
├── README.md                                   # Specific frontend documentation
└── vite.config.js                              #Vite configuration file



```

## Setup Instructions
1. **Install Dependencies**:
    - In vscode, open a terminal (ctrl + ~) 
        Navigat to the Frontend folder then run the following: 
        
        ```bash
        npm install
        npm run dev
        #Use Ctrl+C to terminate development process.
        ```

2. **Access the Application**:
    - Open your browser and navigate to `http://localhost:5173`.
