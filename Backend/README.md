If you are running this project for the first time do the following to set it up:
The commands below are for Windows, so if you're on Mac/Linux, sucks to be you ;)

### Backend Directory Structure

```
Backend/
├── APIRoutes/                  # Backend API Endpoint Routes Called by Frontend. APIs call Services/Drivers
│   ├── ExerciseRoute.py        # Exercise Releated
│   ├── GymRoutes.py            # Gym Related
│   ├── SignInRoutes.py         # Sign In Process Related
│   ├── SwaggerRoutes.py        # Swagger / API Doc Relates
│   ├── UserRoutes.py           # User Realted
│   └── WorkoutRoutes.py        # Workout Related
│
├── DataModels/                 # Data Models to Interact with Collections in the Database.
│   ├── ExerciseObject.py       # Exercise Collection Operations
│   ├── GymObject.py            # Gym Collection Operations
│   ├── MuscleGroupObject.py    # Muscle Group Collection Operations
│   ├── PersonalExerciseObject.p# Personal Exercise Collection Operations
│   ├── UserObject.py           # User Collection Operations
│   └── WorkoutObject.py        # Workout Collection Operations
│
├── Services/                   # Services / Drivers to work between API Route and Data Model. Services Call Object.operations
│   ├── ExerciseDriver.py       # Exercise Driver
│   ├── GymDriver.py            # Gym Driver
│   ├── MongoDriver.py          # Mongo DB Driver
│   ├── SessionDriver.py        # Session Driver (Not Currently In Sprint)
│   ├── SignInDriver.py         # Sign in Driver
│   ├── UserDriver.py           # User Driver
│   └── WorkoutDriver.py        # Workout Driver
│
├── AHFULbackend.py            # Flask App Starting Point (Main)
├── requirements.txt           # Python dependencies
├── .env                       # You Should Create and Update this Manually
└── README.MD                  # This Documentation
```

### Backend Coding Standards
    variableNames = "Use Camel Case"
    
    def naming_functions_uses_lowercase_underscores:

    class ClassNamesUseCapitalCase:


### Backend Environment Setup

All Users:
1. Navigate to the Backend 
2. Create or Locate a .env file in the Root of Backend/ Dir
3. See AHFUL Teams Secrets Channel to copy and paste Backend .env Secrets Post.
4. Ensure MONGODB_URI is Present in your .env
5. Ensure MONGODB_DB is Present in your .env
6. Ensure GOOGLE_CLIENT_ID is Present in your .env

Windows Users:
Run Backend App
```bash
cd Backend

#Install Required Packages and any new Dependencies since last run 
#(Do Not need to run everytime, just on new pulls from Main)
pip install -r requirements.txt

#Run Backend App
python -m flask --app AHFULbackend run --debug
```

Mac Users:
```bash
cd Backend

#Install Required Packages and any new Dependencies since last run 
#(Do Not need to run everytime, just on new pulls from Main)
python3 pip install -r requirements.txt

#Run Backend App
python3 -m flask --app AHFULbackend run --debug
```
Optional for VSCode: Ctrl+Shft+P, Type 'Python: Select Interpreter', Find and select your .venv file


Congrats! If you start up the application and Google doesn't yell at you, you survived!