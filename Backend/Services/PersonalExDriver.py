#Services & Drivers know how to implement business Logic related to the Route operations.  
#   Intermediate between Routes and Objects.  Ensures validations and rules are applied before 
#   Calling Objects to interact with DB
from DataModels.PersonalExObject import PersonalExObject
from DataModels.UserObject import UserObject
from DataModels.WorkoutObject import WorkoutObject
from bson import ObjectId, errors as bson_errors


# The PersonalExDriver is responsible for implementing the business logic related to personalEx operations.
#   It acts as an intermediary between the API routes and the data models, 
#   ensuring that all necessary validations and rules are applied before interacting with 
#   the database.
class PersonalExDriver:

    @staticmethod
    def get_all_personal_exs():
        try:
            personalExs = PersonalExObject.find_all()
            return personalExs, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_personal_ex_by_id(id):
        try:
            personalEx = PersonalExObject.find_by_id(id)
            if not personalEx:
                return None, "PersonalEx not found"
            return personalEx, None
        except Exception as e:
            return None, str(e)
        
    @staticmethod
    def get_personal_exs_by_user(userId):
        try:
            personalEx = PersonalExObject.find_by_user(userId)
            if not personalEx:
                return None, "PersonalEx not found"
            return personalEx, None
        except Exception as e:
            return None, str(e)
        
    @staticmethod
    def get_personal_exs_by_workout(workoutId):
        try:
            personalEx = PersonalExObject.find_by_workout(workoutId)
            if not personalEx:
                return None, "PersonalEx not found"
            return personalEx, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def create_personal_ex(userId, exerciseId, workoutId, reps, sets, weight, duration, distance, complete):
        # Validate required fields
        if (not userId) or (not exerciseId) or (not workoutId):
            return None, "You are missing a userId, workoutId or exerciseId. Please fix, then attempt to create personalEx again"
        
        # Convert IDs safely
        try:
            user_oid = ObjectId(str(userId))
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, "Invalid userId format; must be a 24-hex string"
        
        # Convert IDs safely
        try:
            exercise_oid = ObjectId(str(exerciseId))
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, "Invalid exerciseId format; must be a 24-hex string"
        
        # Convert IDs safely
        try:
            workout_oid = ObjectId(str(workoutId))
        except (bson_errors.InvalidId, TypeError, ValueError):
            return None, "Invalid workoutId format; must be a 24-hex string"

        # Ensure the user exists
        user = UserObject.find_by_id(userId)
        if not user:
            return None, "User not found"
        
        # Ensure the exercise exists
        # exercise = ExerciseObject.find_by_id(exerciseId)
        # if not exercise:
        #     return None, "Exercise not found"

        # Ensure the workout exists
        workout = WorkoutObject.find_by_id(workoutId)
        if not workout:
            return None, "workout not found"


        personal_ex_data = {
            "userId": ObjectId(userId),
            "exerciseId": ObjectId(exerciseId),
            "workoutId": ObjectId(workoutId),
            "reps": reps,
            "sets": sets,
            "weight": weight,
            "duration": duration,
            "distance": distance,
            "complete": complete
        }

        try:
            response = PersonalExObject.create(personal_ex_data)
            return response, None
        except Exception as e:
            return None, str(e)
        
    @staticmethod
    def delete_personal_ex(id):
        # Validate input
        if not id:
            return None, "You must provide a personal ex id to delete"

        try:
            response = PersonalExObject.delete(id)
            if not response:
                # Either not found, or already removed
                return None, "Personal ex not found or already deleted"
            return response, None
        except Exception as e:
            return None, str(e)