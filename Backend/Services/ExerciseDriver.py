#Services & Drivers know how to implement business Logic related to the Route operations.  Intermediate between Routes and Objects.  Ensures validations and rules are applied before Calling Objects to interact with
from DataModels.ExerciseObject import ExerciseObject
from DataModels.UserObject import UserObject
from http.client import HTTPSConnection
import ssl
import certifi
import json
from urllib.parse import urlencode
from bson import ObjectId, errors as bson_errors

#External API Host for ExerciseDB API
EXERSICEDB_HOST = "www.exercisedb.dev"
#Define Headers for External API
EXERSICEDB_HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36", "Accept": "application/json"}
#Define SSL Context for External API
ssl_context = ssl.create_default_context(cafile=certifi.where())

def _create_connection():
    return HTTPSConnection(EXERSICEDB_HOST, context=ssl_context)

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
            if "exercise_id" in new_item and "_id" not in new_item:
                new_item["_id"] = new_item.pop("exercise_id")
            out.append(new_item)
        return out

    @staticmethod
    def _validate_obj_id(id, name):
        try:
            return ObjectId(str(id)), None
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, f"Invalid {name} format; must be a 24-hex string"
        
    @staticmethod
    def verify_operation(user_id, exercise_id):
        if (not user_id) or (not exercise_id):
            return None, "Missing user or exercise_id"
        
        # Convert IDs safely
        user_id, err = ExerciseDriver._validate_obj_id(user_id, "user_id")
        if err:
            return None, err
        # Convert IDs safely
        exercise_id, err = ExerciseDriver._validate_obj_id(exercise_id, "exercise_id")
        if err:
            return None, err
        
        user = UserObject.find_by_id(user_id)
        if not user:
            return None, "User not found"
        exercise = ExerciseObject.find_by_id(exercise_id)
        if not exercise:
            return None, "Exercise not found"
        
        if user["_id"] == exercise["user_id"]:
            return "Operation valid", None
        elif ("Admin" in user["roles"]) or ("Developer" in user["roles"]):
            return "Operation valid", None
        else:
            return None, "You must operate on your own object or have sufficient privileges"

    @staticmethod
    def get_initial_metadata():
        try:
            #Define Connection and Endpoint for External API
            conn = _create_connection()
            apiEndpoint = "/api/v1/exercises?offset=0&limit=25&sortBy=name&sortOrder=desc"
            #Make API Request to External API
            conn.request("GET", apiEndpoint, headers=EXERSICEDB_HEADERS)
            #Assign Response from External API to Variable
            apiResponse = conn.getresponse()
            #Read Response Data and Decode it from bytes to string, then Load it as JSON to get a workable dict
            data = apiResponse.read()                   # bytes  → b'{"success":true...}'
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      
            #Workable Data Looks Like:
            # dict   → {"success": true,"metadata": {"totalPages": 60,"totalExercises": 1500,"currentPage": 1,"previousPage": null,"nextPage": "http://www.exercisedb.dev/api/v1/exercises?offset=25&limit=25&&sortBy=name&sortOrder=desc"},"data": []}
            # To acces it: externalExercises = workableData["data"]
            
            # Handle both direct metadata or wrapped in success response
            if "metadata" in workableData:
                externalMetadata = ExerciseDriver.normalize(workableData["metadata"])
            else:
                externalMetadata = ExerciseDriver.normalize(workableData)
            conn.close()
            return externalMetadata, None
        except Exception as e:
            return None, str(e)
        
    @staticmethod
    def get_next_metadata(currentPage):
        try:
            conn = _create_connection()
            nextPageEndpoint = currentPage["nextPage"]

            conn.request("GET", nextPageEndpoint, headers=EXERSICEDB_HEADERS)
            #Assign Response from External API to Variable
            apiResponse = conn.getresponse()
            #Read Response Data and Decode it from bytes to string, then Load it as JSON to get a workable dict
            data = apiResponse.read()                   # bytes  → b'{"success":true...}'
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      
            #Workable Data Looks Like:
            # dict   → {"success": true,"metadata": {"totalPages": 60,"totalExercises": 1500,"currentPage": 1,"previousPage": null,"nextPage": "http://www.exercisedb.dev/api/v1/exercises?offset=25&limit=25&&sortBy=name&sortOrder=desc"},"data": []}
            # To acces it: externalExercises = workableData["data"]
            
            if "metadata" in workableData:
                externalMetadata = ExerciseDriver.normalize(workableData["metadata"])
            else:
                externalMetadata = ExerciseDriver.normalize(workableData)
            conn.close()
            return externalMetadata, None
        except Exception as e:
            return None, str(e)
        
    @staticmethod
    def get_prev_metadata(currentPage):
        try:
            conn = _create_connection()
            prevPageEndpoint = currentPage["previousPage"]

            conn.request("GET", prevPageEndpoint, headers=EXERSICEDB_HEADERS)
            #Assign Response from External API to Variable
            apiResponse = conn.getresponse()
            #Read Response Data and Decode it from bytes to string, then Load it as JSON to get a workable dict
            data = apiResponse.read()                   # bytes  → b'{"success":true...}'
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      
            #Workable Data Looks Like:
            # dict   → {"success": true,"metadata": {"totalPages": 60,"totalExercises": 1500,"currentPage": 1,"previousPage": null,"nextPage": "http://www.exercisedb.dev/api/v1/exercises?offset=25&limit=25&&sortBy=name&sortOrder=desc"},"data": []}
            # To acces it: externalExercises = workableData["data"]
            
            if "metadata" in workableData:
                externalMetadata = ExerciseDriver.normalize(workableData["metadata"])
            else:
                externalMetadata = ExerciseDriver.normalize(workableData)
            conn.close()
            return externalMetadata, None
        except Exception as e:
            return None, str(e)
        
#--------------------------------------------------------------------------------------------------------------------------------------------------
        
    @staticmethod
    def get_initial_exercises():
        try:
            #Define Connection and Endpoint for External API
            conn = _create_connection()
            apiEndpoint = "/api/v1/exercises?offset=0&limit=25&sortBy=name&sortOrder=desc"
            #Make API Request to External API
            conn.request("GET", apiEndpoint, headers=EXERSICEDB_HEADERS)
            #Assign Response from External API to Variable
            apiResponse = conn.getresponse()
            #Read Response Data and Decode it from bytes to string, then Load it as JSON to get a workable dict
            data = apiResponse.read()                   # bytes  → b'{"success":true...}'
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      
            #Workable Data Looks Like:
            # dict   → {"success": true,"metadata": {"totalPages": 60,"totalExercises": 1500,"currentPage": 1,"previousPage": null,"nextPage": "http://www.exercisedb.dev/api/v1/exercises?offset=25&limit=25&&sortBy=name&sortOrder=desc"},"data": []}
            # To acces it: externalExercises = workableData["data"]
            
            # Handle both direct data array or wrapped in success response
            if "data" in workableData:
                externalExercises = ExerciseDriver.normalize(workableData["data"])
            else:
                externalExercises = ExerciseDriver.normalize(workableData)
            conn.close()

            internalExercises = ExerciseObject.find_all()

            exercises = internalExercises + externalExercises
            return exercises, None
        except Exception as e:
            return None, str(e)
        
    @staticmethod
    def get_next_exercises(currentMeta):
        try:
            conn = _create_connection()
            nextPageEndpoint = currentMeta["nextPage"]

            conn.request("GET", nextPageEndpoint, headers=EXERSICEDB_HEADERS)
            apiResponse = conn.getresponse()
            data = apiResponse.read()                   # bytes  → b'{"success":true...}'
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      # dict   → {"success": True,
            
            if "data" in workableData:
                externalExercises = ExerciseDriver.normalize(workableData["data"])
            else:
                externalExercises = ExerciseDriver.normalize(workableData)
            conn.close()
            return externalExercises, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_prev_exercises(currentMeta):
        try:
            conn = _create_connection()
            prevPageEndpoint = currentMeta["previousPage"]

            conn.request("GET", prevPageEndpoint, headers=EXERSICEDB_HEADERS)
            apiResponse = conn.getresponse()
            data = apiResponse.read()                   # bytes  → b'{"success":true...}'
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      # dict   → {"success": True,
            
            if "data" in workableData:
                externalExercises = workableData["data"]
            else:
                externalExercises = workableData
            conn.close()
            return externalExercises, None
        except Exception as e:
            return None, str(e)


        
    #Search exercises by name using external API and internal DB, then combine results
    @staticmethod
    def search_exercises(searchString):
        try:
            #Define Connection and Endpoint for External API
            conn = _create_connection()
            
            # Properly encode the query string
            query = urlencode({"q": searchString})  # e.g., q=bench+press+chest+dumbbell
            apiEndpoint = f"/api/v1/exercises/search?{query}"

            #Make API Request to External API
            conn.request("GET", apiEndpoint, headers=EXERSICEDB_HEADERS)

            #Assign Response from External API to Variable
            apiResponse = conn.getresponse()

            #Read Response Data and Decode it from bytes to string, then Load it as JSON to get a workable dict
            data = apiResponse.read()                   # bytes  → b'{"success":true...}'
            decodedData = data.decode("utf-8")          # string → '{"success":true...}'
            workableData = json.loads(decodedData)      # dict   → {"success": True, "data": [...]}

            # Extract Exercise List from External API Response
            if "data" in workableData:
                exercisesList = ExerciseDriver.normalize(workableData["data"])
            else:
                exercisesList = ExerciseDriver.normalize(workableData)
            conn.close()

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
        
        if oid:
            try:
                int_exercise = ExerciseObject.find_by_id(id)
                return int_exercise, None
            except Exception as e:
                return None, str(e)
        
        else:
            try:
                #Define Connection and Endpoint for External API
                conn = _create_connection()
            
                # Properly encode the query string
                apiEndpoint = f"/api/v1/exercises/{id}"

                #Make API Request to External API
                conn.request("GET", apiEndpoint, headers=EXERSICEDB_HEADERS)

                #Assign Response from External API to Variable
                apiResponse = conn.getresponse()

                #Read Response Data and Decode it from bytes to string, then Load it as JSON to get a workable dict
                data = apiResponse.read()                   # bytes  → b'{"success":true...}'
                decodedData = data.decode("utf-8")          # string → '{"success":true...}'
                workableData = json.loads(decodedData)      # dict   → {"success": True, "data": [...]}

                # Extract Exercise List from External API Response
                if "data" in workableData:
                    exercisesList = ExerciseDriver.normalize(workableData["data"])
                else:
                    exercisesList = ExerciseDriver.normalize(workableData)
                conn.close()

                if exercisesList:
                    return exercisesList[0], None
                else:
                    return None, "Exercise not found"
            except Exception as e:
                return None, "Exercise not found"

    @staticmethod
    def create_exercise(formData):
        try:
            instructions_raw = formData.get("instructions", "")
            if isinstance(instructions_raw, str):
                instructions = [line.strip() for line in instructions_raw.split("\n") if line.strip()]
            else:
                instructions = instructions_raw if isinstance(instructions_raw, list) else []

            equipment_value = formData.get("equipment", "")
            equipments = [equipment_value] if equipment_value else []

            exercise_data = {
                "name": formData.get("name"),
                "targetMuscles": formData.get("targetMuscles", []),
                "bodyParts": formData.get("bodyParts", []),
                "equipments": equipments,
                "secondaryMuscles": formData.get("secondaryMuscles", []),
                "instructions": instructions,
                "gifUrl": formData.get("gifUrl", ""),
            }
            
            exercise_id, error = ExerciseObject.create(exercise_data)
            if error:
                return None, error
            return exercise_id, None
        except Exception as e:
            return None, str(e)

    def update_exercise(exercise_id, update_data):
        try:
            existing_exercise = ExerciseObject.find_by_id(exercise_id)
            if not existing_exercise:
                return False, "Exercise not found"

            # Update fields
            for key in ["name", "body_part", "difficulty", "equipment", "instructions", "type"]:
                if key in update_data:
                    existing_exercise[key] = update_data[key]

            # Save updated exercise
            ExerciseObject.update(exercise_id, existing_exercise)
            return True, None
        except Exception as e:
            return False, str(e)
        
    @staticmethod
    def delete_exercise(exercise_id):
        exercise_id, err = ExerciseDriver._validate_obj_id(exercise_id, "exercise_id")
        if err:
            return None, err
        try:
            existing_exercise = ExerciseObject.find_by_id(exercise_id)
            if not existing_exercise:
                return False, "Exercise not found"

            ExerciseObject.delete(exercise_id)
            return True, None
        except Exception as e:
            return False, str(e)
        

    @staticmethod
    def get_bodyparts():
        try:
            conn = _create_connection()
            conn.request("GET", "/api/v1/bodyparts", headers=EXERSICEDB_HEADERS)
            response = conn.getresponse()
            data = response.read()
            json_response = json.loads(data)
            conn.close()
            # Handle both {"data": [...]} and direct array [...]} responses
            if isinstance(json_response, list):
                return json_response, None
            return json_response.get("data", []), None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_muscles():
        try:
            conn = _create_connection()
            conn.request("GET", "/api/v1/muscles", headers=EXERSICEDB_HEADERS)
            response = conn.getresponse()
            data = response.read()
            json_response = json.loads(data)
            conn.close()
            # Handle both {"data": [...]} and direct array [...]} responses
            if isinstance(json_response, list):
                return json_response, None
            return json_response.get("data", []), None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_equipments():
        try:
            conn = _create_connection()
            conn.request("GET", "/api/v1/equipments", headers=EXERSICEDB_HEADERS)
            response = conn.getresponse()
            data = response.read()
            json_response = json.loads(data)
            conn.close()
            # Handle both {"data": [...]} and direct array [...]} responses
            if isinstance(json_response, list):
                return json_response, None
            return json_response.get("data", []), None
        except Exception as e:
            return None, str(e)
