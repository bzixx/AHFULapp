### Backend Directory Structure
```
Backend/
├── APIRoutes/                  # Backend API Endpoint Routes Called by Frontend. APIs call Services/Drivers
│   ├── ExerciseRoute.py        # Exercise Releated
│   ├── FoodRoutes.py           # Food Releated
│   ├── GymRoutes.py            # Gym Related
│   ├── MeasurementRotues.py    # Body Measurement Related
│   ├── PersonalExRoutes.py     # SPersonal Exercise Related
│   ├── SignInRoutes.py         # Sign In Process Related
│   ├── SwaggerRoutes.py        # Swagger / API Doc Relates
│   ├── UserRoutes.py           # User Realted
│   └── WorkoutRoutes.py        # Workout Related
│
├── DataModels/                 # Data Models to Interact with Collections in the Database.
│   ├── ExerciseObject.py       # Exercise Collection Operations
│   ├── FoodObject.py           # Food Collection Operations
│   ├── GymObject.py            # Gym Collection Operations
│   ├── MeasurementObject.py    # Measurement Collection Operations
│   ├── PersonalExObject.py     # Personal Exercise Collection Operations
│   ├── UserObject.py           # User Collection Operations
│   └── WorkoutObject.py        # Workout Collection Operations
│
├── Services/                   # Services / Drivers to work between API Route and Data Model. Services Call Object.operations
│   ├── __init__.py             # put here so services can be detected as a package for github actions
│   ├── ExerciseDriver.py       # Exercise Driver
│   ├── FoodDriver.py           # Food Driver
│   ├── GymDriver.py            # Gym Driver
│   ├── MeasurementDriver.py    # Measurements Driver
│   ├── MongoDriver.py          # Mongo DB Driver
│   ├── PersonalExDriver.py     # Personal Exercise Driver
│   ├── SessionDriver.py        # Session Driver (Not Currently In Sprint)
│   ├── SignInDriver.py         # Sign in Driver
│   ├── UserDriver.py           # User Driver
│   └── WorkoutDriver.py        # Workout Driver
│
├── tests/                      # Tests for Github
│   └── test_routes.py          # All testing routes that github runs on cpull requests to main.
│
├── AHFULbackend.py             # Flask App Starting Point (Main)
├── requirements.txt            # Python dependencies
├── .env                        # You Should Create and Update this Manually
└── README.MD                   # This Documentation
```

### Backend Coding Standards
    variableNames = "Use Camel Case"
    
    def naming_functions_uses_lowercase_underscores:

    class ClassNamesUseCapitalCase:

    FilesAndFoldersUseCapitalCase.py

### Backend Environment & Virtualenv (recommended)

If you're running this project for the first time, it's recommended to use a Python virtual environment to keep dependencies isolated.

High-level steps (all platforms):

1. Navigate to the `Backend/` folder.
2. Create and activate a virtual environment (if you don't already have one).
3. Install dependencies from `requirements.txt` inside the venv.
4. Create or update your `.env` file with the secrets (see your team's secrets channel).
5. Run the Flask app from inside the virtual environment.

Notes about the `.env` file:
- Place a `.env` file in the root of `Backend/` with all required keys (ask your team for the exact contents).

macOS (zsh) — recommended workflow

1) Open a terminal and change to the Backend folder:

```bash
cd Backend
```

2) Check you have a suitable Python 3.x:

```bash
python3 --version
# or
which python3
```

3) Create a virtual environment (creates a directory named `.venv`):

```bash
python3 -m venv .venv
```

4) Activate the virtual environment (zsh / bash):

```bash
source .venv/bin/activate
```

5) Verify the venv is active and the interpreter is from `.venv`:

```bash
# Should show path inside the .venv directory
which python
echo "$VIRTUAL_ENV"
```

6) Upgrade packaging tools (optional but recommended):

```bash
pip install --upgrade pip setuptools wheel
```

7) Install project requirements:

```bash
pip install -r requirements.txt
```

8) Run the Flask app (still inside the activated venv):

```bash
python -m flask --app AHFULbackend run --debug
```

9) When you're done, deactivate the venv:

```bash
deactivate
```

Windows (PowerShell) — recommended workflow

1) Open PowerShell and change to the Backend folder:

```powershell
cd Backend
```

2) Create a virtual environment:

```powershell
python -m venv .venv
```

3) Activate the venv (PowerShell):

```powershell
.\.venv\Scripts\Activate.ps1
```

4) Verify activation:

```powershell
where.exe python
echo $env:VIRTUAL_ENV
```

5) Upgrade pip and install dependencies:

```powershell
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

6) Run the Flask app:

```powershell
python -m flask --app AHFULbackend run --debug
```

Quick checks & troubleshooting

- If `python3` / `python` is missing or reports an older version, install a modern Python (3.8+) via your system package manager or use pyenv.
- If activation fails on Windows PowerShell with an execution policy error, run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` as admin (or follow your org policies).
- If `pip install -r requirements.txt` fails for a package with native extensions, ensure Xcode command line tools are installed on macOS: `xcode-select --install`.
- To confirm you're installing into the venv: run `pip --version` and check the path printed refers to the `.venv` directory.

Environment checklist (success criteria)

- `python --version` returns a valid Python 3.x inside the venv.
- `pip list` shows installed packages from `requirements.txt`.
- `python -m flask --app AHFULbackend run --debug` starts the app without import errors.

If you'd like, I can also add a tiny convenience Makefile or shell script for macOS that automates venv creation, activation, and running the server. Let me know which you'd prefer and I'll add it.
Optional for VSCode: Ctrl+Shft+P, Type 'Python: Select Interpreter', Find and select your .venv file


Congrats! If you start up the application and Google doesn't yell at you, you survived!