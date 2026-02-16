If you are running this project for the first time do the following to set it up:
The commands below are for Windows, so if you're on Mac/Linux, sucks to be you ;)

### Backend Directory Structure

```
backend/
├── flaskr/                     # Flask application package
│   ├── __init__.py            # Application factory with CORS and services
│   ├            
│   ├            
│   ├── API_routes/                 #This is where the URL Routes are created
│   │   ├── awsCredsController.py # AWS credential management routes
│   │   ├── data_api_routes.py    # Data API endpoints
│   │   └── test.py            # Enhanced API routes with credentials
│   ├── services/              # Business logic services
│   │   ├── db.py              # Database connection management
│   │   ├── mongodbService.py  # MongoDB operations
│   │   ├── mail.py            # Email notification services
│   │   └── assumeRoleAttemptsDBService.py # Role attempt tracking
│   ├── tests/                 # Test suites
│   │   ├── routes/            # Route testing
│   │   └── services/          # Service testing
│   └── .env                   # Environment configuration
├── AWSCore/                   # AWS integration modules
│   ├── aws_client.py          # AWS SDK client wrapper
│   ├── discovery_with_db_storage.py # Discovery with database storage
│   ├── dynamic_role_chain.py  # Dynamic role chaining logic
│   ├── role_analyzer.py       # Role analysis and privilege mapping
│   └── test_aws_client.py     # AWS client testing
├── app.py                     # Flask entry point (optional)
├── requirements.txt           # Python dependencies
├── pytest.ini                # Test configuration
├── run_discovery_with_storage.py # Discovery execution script
└── standalone_db_service.py   # Standalone MongoDB operations
```
### Backend Environment Setup

Windows Users:
```bash
cd backend
py -m venv .venv
.venv\Scripts\activate.bat.
pip install -r requirements.txt
```

Run Backend App
```bash
python -m flask --app AHFULbackend run --debug
```

# Create and configure .env file in flaskr/ directory
# Add MongoDB connection string, Flask configuration, etc.
```
Mac Users:
```bash
cd backend
python3 -m venv .venv
source ./venv/bin/activate
python3 pip install -r requirements.txt

#Run Backend App
python3 -m flask --app AHFULbackend run --debug
```
Optional for VSCode: Ctrl+Shft+P, Type 'Python: Select Interpreter', Find and select your .venv file

# To connect Database:

You will need the MonogDB connection string for the backend.
Setup guide:

1. Navigate to the backend/ directory
2. create a .env file
3. See teams for copy and paste



Congrats! If you start up the application and Google doesn't yell at you, you survived!