#Services & Drivers know how to implement business Logic related to the Route operations.  Intermediate between Routes and Objects.  Ensures validations and rules are applied before Calling Objects to interact with
from DataModels.ExerciseObject import ExerciseObject
from urllib.parse import urlencode
from http.client import HTTPSConnection
import json
from urllib.parse import urlencode
from bson import ObjectId, errors as bson_errors

#External API Host for ExerciseDB API
EXERSICEDB_HOST = "www.exercisedb.dev"
#Define Headers for External API
EXERSICEDB_HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", "Accept": "application/json"}
#Define Connection External API
externalDBConnection =  HTTPSConnection(EXERSICEDB_HOST)

class ExerciseDriver:
    @staticmethod
    def normalize(items):
        if not items:
            return []

        # If we got a single dict, wrap it in a list
        if isinstance(items, dict):
            items = [items]
        elif not isinstance(items, (list, tuple)):
            # Unknown shape; bail out safely
            return []

        out = []
        for item in items:
            if not isinstance(item, dict):
                continue
            new_item = dict(item)  # shallow copy
            if "exerciseId" in new_item and "_id" not in new_item:
                new_item["_id"] = new_item.pop("exerciseId")
            out.append(new_item)
        return out

    @staticmethod
    def _validate_obj_id(id, name):
        try:
            return ObjectId(str(id)), None
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, f"Invalid {name} format; must be a 24-hex string"

    def get_initial_metadata():
        try:
            #Define Endpoint for External API
            apiEndpoint = "/api/v1/exercises?offset=0&limit=25&sortBy=name&sortOrder=desc"
            #Make API Request to External API
            externalDBConnection.request("GET", apiEndpoint, headers=EXERSICEDB_HEADERS)
            #Assign Response from External API to Variable
            apiResponse = externalDBConnection.getresponse()
            #Read Response Data and Decode it from bytes to string, then Load it as JSON to get a workable dict
            data = apiResponse.read()                   # bytes  → b'{"success":true...}'
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      
            #Workable Data Looks Like:
            # dict   → {"success": true,"metadata": {"totalPages": 60,"totalExercises": 1500,"currentPage": 1,"previousPage": null,"nextPage": "http://www.exercisedb.dev/api/v1/exercises?offset=25&limit=25&&sortBy=name&sortOrder=desc"},"data": []}
            # To acces it: externalExercises = workableData["data"]
            externalMetadata = ExerciseDriver.normalize(workableData["metadata"])

            return externalMetadata, None
        except Exception as e:
            return None, str(e)
        
    def get_next_metadata(currentPage):
        try:
            nextPageEndpoint = currentPage["nextPage"]

            externalDBConnection.request("GET", nextPageEndpoint, headers=EXERSICEDB_HEADERS)
            #Assign Response from External API to Variable
            apiResponse = externalDBConnection.getresponse()
            #Read Response Data and Decode it from bytes to string, then Load it as JSON to get a workable dict
            data = apiResponse.read()                   # bytes  → b'{"success":true...}'
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      
            #Workable Data Looks Like:
            # dict   → {"success": true,"metadata": {"totalPages": 60,"totalExercises": 1500,"currentPage": 1,"previousPage": null,"nextPage": "http://www.exercisedb.dev/api/v1/exercises?offset=25&limit=25&&sortBy=name&sortOrder=desc"},"data": []}
            # To acces it: externalExercises = workableData["data"]
            externalMetadata = ExerciseDriver.normalize(workableData["metadata"])

            return externalMetadata, None
        except Exception as e:
            return None, str(e)
        
    def get_prev_metadata(currentPage):
        try:
            prevPageEndpoint = currentPage["previousPage"]

            externalDBConnection.request("GET", prevPageEndpoint, headers=EXERSICEDB_HEADERS)
            #Assign Response from External API to Variable
            apiResponse = externalDBConnection.getresponse()
            #Read Response Data and Decode it from bytes to string, then Load it as JSON to get a workable dict
            data = apiResponse.read()                   # bytes  → b'{"success":true...}'
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      
            #Workable Data Looks Like:
            # dict   → {"success": true,"metadata": {"totalPages": 60,"totalExercises": 1500,"currentPage": 1,"previousPage": null,"nextPage": "http://www.exercisedb.dev/api/v1/exercises?offset=25&limit=25&&sortBy=name&sortOrder=desc"},"data": []}
            # To acces it: externalExercises = workableData["data"]
            externalMetadata = ExerciseDriver.normalize(workableData["metadata"])

            return externalMetadata, None
        except Exception as e:
            return None, str(e)
        
#--------------------------------------------------------------------------------------------------------------------------------------------------
        
    def get_initial_exercises():
        try:
            #Define Endpoint for External API
            apiEndpoint = "/api/v1/exercises?offset=0&limit=25&sortBy=name&sortOrder=desc"
            #Make API Request to External API
            externalDBConnection.request("GET", apiEndpoint, headers=EXERSICEDB_HEADERS)
            #Assign Response from External API to Variable
            apiResponse = externalDBConnection.getresponse()
            #Read Response Data and Decode it from bytes to string, then Load it as JSON to get a workable dict
            data = apiResponse.read()                   # bytes  → b'{"success":true...}'
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      
            #Workable Data Looks Like:
            # dict   → {"success": true,"metadata": {"totalPages": 60,"totalExercises": 1500,"currentPage": 1,"previousPage": null,"nextPage": "http://www.exercisedb.dev/api/v1/exercises?offset=25&limit=25&&sortBy=name&sortOrder=desc"},"data": []}
            # To acces it: externalExercises = workableData["data"]
            externalExercises = ExerciseDriver.normalize(workableData["data"])

            internalExercises = ExerciseObject.find_all()

            exercises = internalExercises + externalExercises
            return exercises, None
        except Exception as e:
            return None, str(e)
        
    def get_next_exercises(currentMeta):
        try:
            nextPageEndpoint = currentMeta["nextPage"]

            externalDBConnection.request("GET", nextPageEndpoint, headers=EXERSICEDB_HEADERS)
            apiResponse = externalDBConnection.getresponse()
            data = apiResponse.read()                   # bytes  → b'{"success":true...
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      # dict   → {"success": True,
            externalExercises = ExerciseDriver.normalize(workableData["data"])

            return externalExercises, None
        except Exception as e:
            return None, str(e)

    def get_prev_exercises(currentMeta):
        try:
            prevPageEndpoint = currentMeta["previousPage"]

            externalDBConnection.request("GET", prevPageEndpoint, headers=EXERSICEDB_HEADERS)
            apiResponse = externalDBConnection.getresponse()
            data = apiResponse.read()                   # bytes  → b'{"success":true...
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      # dict   → {"success": True,
            externalExercises = workableData["data"]

            return externalExercises, None
        except Exception as e:
            return None, str(e)


        
    #Search exercises by name using external API and internal DB, then combine results
    def search_exercises(searchString):
        try:
            #Define Connection and Endpoint for External API
            dbConnection =  HTTPSConnection(EXERSICEDB_HOST)
            
            # Properly encode the query string
            query = urlencode({"q": searchString})  # e.g., q=bench+press+chest+dumbbell
            apiEndpoint = f"/api/v1/exercises/search?{query}"

            #Make API Request to External API
            dbConnection.request("GET", apiEndpoint, headers=EXERSICEDB_HEADERS)

            #Assign Response from External API to Variable
            apiResponse = dbConnection.getresponse()

            #Read Response Data and Decode it from bytes to string, then Load it as JSON to get a workable dict
            data = apiResponse.read()                   # bytes  → b'{"success":true...}'
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      # dict   → {"success": True, "data": [...]}

            # Extract Exercise List from External API Response
            exercisesList = ExerciseDriver.normalize(workableData["data"])

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
        
    @staticmethod
    def get_exercise_by_id(id):
        # Convert IDs safely
        oid, err = ExerciseDriver._validate_obj_id(id, "exercise id")
        print("oid", oid)
        print("err", err)
        
        if oid:
            print("*")
            try:
                int_exercise = ExerciseObject.find_by_id(id)
                return int_exercise, None
            except Exception as e:
                print(None, str(e))
        
        else:
            print("#")
            try:
                #Define Connection and Endpoint for External API
                dbConnection =  HTTPSConnection(EXERSICEDB_HOST)
            
                # Properly encode the query string
                apiEndpoint = f"/api/v1/exercises/{id}"

                #Make API Request to External API
                dbConnection.request("GET", apiEndpoint, headers=EXERSICEDB_HEADERS)

                #Assign Response from External API to Variable
                apiResponse = dbConnection.getresponse()

                #Read Response Data and Decode it from bytes to string, then Load it as JSON to get a workable dict
                data = apiResponse.read()                   # bytes  → b'{"success":true...}'
                decodedData = data.decode("utf-8")          # string → '{"success":true...}'
                workableData = json.loads(decodedData)      # dict   → {"success": True, "data": [...]}

                print("workableData", workableData)

                # Extract Exercise List from External API Response
                exercisesList = ExerciseDriver.normalize(workableData["data"])

                print("exercisesList", exercisesList)

                if exercisesList:
                    return exercisesList[0], None,
                else:
                    return None, "Exercise not found"
            except Exception as e:
                return None, "Exercise not found"

    def create_exercise(formData):
        try:
            exercise_data = {
                "name": formData.get("name"),
                "body_part": formData.get("body_part"),
                "difficulty": formData.get("difficulty"),
                "equipment": formData.get("equipment"),
                "instructions": formData.get("instructions"),
                "type": formData.get("type")
            }
            exercise_id = ExerciseObject.create(exercise_data)
            return exercise_id, None
        except Exception as e:
            return None, str(e)

    # def update_exercise(exercise_id, update_data):
    #     try:
    #         existing_exercise = ExerciseObject.find_by_id(exercise_id)
    #         if not existing_exercise:
    #             return False, "Exercise not found"

    #         # Update fields
    #         for key in ["name", "body_part", "difficulty", "equipment", "instructions", "type"]:
    #             if key in update_data:
    #                 existing_exercise[key] = update_data[key]

    #         # Save updated exercise
    #         ExerciseObject.update(exercise_id, existing_exercise)
    #         return True, None
    #     except Exception as e:
    #         return False, str(e)
        
    def delete_exercise(exercise_id):
        try:
            existing_exercise = ExerciseObject.find_by_id(exercise_id)
            if not existing_exercise:
                return False, "Exercise not found"

            ExerciseObject.delete(exercise_id)
            return True, None
        except Exception as e:
            return False, str(e)
        