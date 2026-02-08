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
py run.py
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
python3 -m flask --app flaskr run --debug
```
Optional for VSCode: Ctrl+Shft+P, Type 'Python: Select Interpreter', Find and select your .venv file

# To connect Database:

You will need the MonogDB connection string for the backend.
Setup guide:

1. Navigate to the backend/ directory
2. create a .env file
3. See teams for copy and paste

# Brevo (Emailing service) Set up:

You will ned the Brevo API key for this step

1. Edit your .env file and enter the api BREVO_API_KEY=(See Teams)

# The .env is in the .gitignore so changes won't be tracked. DO NOT commit any secrets to the database

To run tests:

1. Navigate to the backend directory
2. Run(Windows): py -m pytest


# Cert Generation/Config (REQUIRED)
🚀 1. Prerequisites

You must have Git for Windows installed:

https://gitforwindows.org/

It includes:

OpenSSL (required for certificate generation)

Add C:\Program Files\Git\user\bin (or wherever your openssl.exe is stored) to your SYSTEM environment variables

📁 2. Create a shared certificate folder

Create a folder in your C Drive projects:

```bash
C:\dev-certs\
```

🔐 3. Generate a local HTTPS certificate

Create a file called localhost.cnf with the following as its contents:
```txt
[req]
default_bits       = 2048
prompt             = no
default_md         = sha256
distinguished_name = dn
req_extensions     = req_ext

[dn]
CN = localhost

[req_ext]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost

[x509_ext]
subjectAltName = @alt_names
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
```

Open a Command Prompt and navigate to your created directory:

```bash
cd /c/dev-certs
```

To Generate the cert files run:
NOTE: .crt files are cert files for Windows, this will mostly likely not work on Mac/Linux
```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout localhost.key -out localhost.crt -config localhost.cnf -extensions x509_ext
```
Verify that the SAN was set properly by running this command:

```bash
openssl x509 -in localhost.crt -text -noout | findstr /C:"DNS:"
```

You should see the following results:

```bash
DNS:localhost
```

If you see nothing, delete the .crt file generated and try again

Now you have:

C:\dev-certs\localhost.crt   (Windows installer format/server certificate)
C:\dev-certs\localhost.key    (private key)

🏷 5. Install certificate into Windows Trusted Root Store

Windows must trust this certificate so browsers accept HTTPS.

Steps:

1. Double-click C:\dev-certs\cert.crt

2. Click Install Certificate

3. Choose Local Machine

4. Select:

- Place all certificates in the following store

- Click Browse and choose:

✔ Trusted Root Certification Authorities

5. Finish → Yes → OK

Your system will now trust https://localhost served using these certs.

6. Add file paths to both the certificate and the private key to your .env files

The frontend AND backend must both have .env with the following entries in EACH:

```txt
SSL_CRT_FILE=C:/dev_certs/localhost.crt
SSL_KEY_FILE=C:/dev_certs/localhost.key
```

Congrats! If you start up the application and Google doesn't yell at you, you survived!