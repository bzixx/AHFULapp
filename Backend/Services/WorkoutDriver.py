from DataModels.WorkoutObject import WorkoutObject
from werkzeug.security import generate_password_hash, check_password_hash

#Services & Drivers know how to implement business Logic related to the Route operations.  Intermediate between Routes and Objects.  Ensures validations and rules are applied before Calling Objects to interact with DB

class WorkoutDriver:

    @staticmethod
    def get_all_workouts():
        try:
            workouts = WorkoutObject.find_all()
            return workouts, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_workout_by_id(id):
        try:
            workout = WorkoutObject.find_by_id(id)
            if not workout:
                return None, "Workout not found"
            return workout, None
        except Exception as e:
            return None, str(e)
        
    @staticmethod
    def get_workouts_by_email(email):
        print(email)
        try:
            workout = WorkoutObject.find_by_email(email)
            if not workout:
                return None, "Workout not found"
            return workout, None
        except Exception as e:
            return None, str(e)

    @staticmethod
    def create_workout(email, gymId, title, startTime, endTime):
        # Validate required fields
        if (not email) or (startTime is None):
            return None, "You are missing an email or startTime. Please fix, then attempt to create workout again"

        workout_data = {
            "userEmail": email,
            "gymId": gymId,
            "title": title,
            "startTime": startTime,
            "endTime": endTime
        }

        try:
            response = WorkoutObject.create(workout_data)
            return response, None
        except Exception as e:
            return None, str(e)