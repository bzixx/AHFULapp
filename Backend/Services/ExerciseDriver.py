#Services & Drivers know how to implement business Logic related to the Route operations.  Intermediate between Routes and Objects.  Ensures validations and rules are applied before Calling Objects to interact with
from DataModels.ExerciseObject import ExerciseObject
from http.client import HTTPSConnection
import json

#External API Host for ExerciseDB API
EXERSICEDB_HOST = "exercisedbv2.ascendapi.com"

class ExerciseDriver:

    def get_all_exercises():
        try:
            exercises = ExerciseObject.find_all()
            return exercises, None
        except Exception as e:
            return None, str(e)

    #Search exercises by name using external API and internal DB, then combine results
    def search_exercises(searchString):
        try:
            #Define Headers for Extnerla API
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", "Accept": "application/json"}
            
            #Define Connection and Endpoint for External API
            dbConnection =  HTTPSConnection(EXERSICEDB_HOST)
            apiEndpoint = "/api/v1/exercises/search?search=" + searchString

            #Make API Request to External API
            dbConnection.request("GET", apiEndpoint, headers=headers)

            #Assign Response from External API to Variable
            apiResponse = dbConnection.getresponse()

            #Read Response Data and Decode it from bytes to string, then Load it as JSON to get a workable dict
            data = apiResponse.read()                   # bytes  → b'{"success":true...}'
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      # dict   → {"success": True, "data": [...]}

            # Extract Exercise List from External API Response
            exercisesList = workableData["data"]

            #Internal search for exercises that match the search string (case-insensitive) and combine with external API results
            internalWorkableData = ExerciseObject.find_all()

            # Filter internal exercises based on search string
            filtered_exercises = [
                ex                                              # 1. keep this item
                for ex in internalWorkableData                  # 2. loop through every exercise
                if searchString.lower() in ex["name"].lower()   # 3. only if this condition is true
            ]

            #Combine All Exercises and Return
            totalList = filtered_exercises + exercisesList
            return totalList, None
        
        except ValueError as e:
            return None, "Invalid JSON response: " + str(e)
        except Exception as e:
            return None, str(e)

    def create_exercise(name, muscle_group, difficulty, equipment, instructions):
        try:
            exercise_data = {
                "name": name,
                "muscle_group": muscle_group,
                "difficulty": difficulty,
                "equipment": equipment,
                "instructions": instructions
            }
            exercise_id = ExerciseObject.create(exercise_data)
            return exercise_id, None
        except Exception as e:
            return None, str(e)

    def update_exercise(exercise_id, update_data):
        try:
            existing_exercise = ExerciseObject.find_by_id(exercise_id)
            if not existing_exercise:
                return False, "Exercise not found"

            # Update fields
            for key in ["name", "muscle_group", "difficulty", "equipment", "instructions"]:
                if key in update_data:
                    existing_exercise[key] = update_data[key]

            # Save updated exercise
            ExerciseObject.update(exercise_id, existing_exercise)
            return True, None
        except Exception as e:
            return False, str(e)
        
    def delete_exercise(exercise_id):
        try:
            existing_exercise = ExerciseObject.find_by_id(exercise_id)
            if not existing_exercise:
                return False, "Exercise not found"

            ExerciseObject.delete(exercise_id)
            return True, None
        except Exception as e:
            return False, str(e)
        