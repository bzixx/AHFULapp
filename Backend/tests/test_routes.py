import os
import requests
from bson import ObjectId, errors as bson_errors
from Services.GymDriver import GymDriver
from Services.UserDriver import UserDriver
from Services.FoodDriver import FoodDriver
from Services.PersonalExDriver import PersonalExDriver
from Services.WorkoutDriver import WorkoutDriver

# Food

def test_find_food_by_id():
    # Give a valid gymId
    oid = "699d0f5f888d8f649698307e"
    food, err = FoodDriver.get_food_by_id(oid)

    if err is not None:
        print(food, err)

    # Assertions
    assert err is None
    assert food is not None
    assert food.get("_id") == oid
    assert food.get("userId") == "699d0093795741a59fe13616"
    assert food.get("name") == "Apple"
    assert food.get("calsPerServing") == 95
    assert food.get("servings") == 1
    assert food.get("type") == "Lunch"
    assert food.get("time") == 1708473601

    # Give a bad userId
    bad_oid = "699d0f5f888d8f649698307"
    food, err = FoodDriver.get_food_by_id(bad_oid)

    if err is not None:
        print(food, err)

    # Expected
    bad_err_code = "\'" + bad_oid + "\' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
    
    # Assertions
    assert food is None
    assert err == bad_err_code

    # Give an invalid userId
    inv_oid = "000000000000000000000000"
    food, err = FoodDriver.get_food_by_id(inv_oid)

    if err is not None:
        print(food, err)

    # Expected
    inv_err_code = "Food not found"
    
    # Assertions
    assert food is None
    assert err == inv_err_code

def test_find_food_by_user():
    # Give a valid email
    userId = "699d0093795741a59fe13616"
    foods, err = FoodDriver.get_food_by_user(userId)

    food = next((item for item in foods if item["_id"] == "699d0f5f888d8f649698307e"), None)

    if err is not None:
        print(food, err)

    # Assertions
    assert err is None
    assert food is not None
    assert food.get("_id") == "699d0f5f888d8f649698307e"
    assert food.get("userId") == userId
    assert food.get("name") == "Apple"
    assert food.get("calsPerServing") == 95
    assert food.get("servings") == 1
    assert food.get("type") == "Lunch"
    assert food.get("time") == 1708473601

   # Give a bad userId
    bad_userId = "699d0093795741a59fe1361"
    food, err = FoodDriver.get_food_by_user(bad_userId)

    if err is not None:
        print(food, err)

    # Expected
    bad_err_code = "\'" + bad_userId + "\' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
    
    # Assertions
    assert food is None
    assert err == bad_err_code

    # Give an invalid userId
    inv_oid = "000000000000000000000000"
    food, err = FoodDriver.get_food_by_id(inv_oid)

    if err is not None:
        print(food, err)

    # Expected
    inv_err_code = "Food not found"
    
    # Assertions
    assert food is None
    assert err == inv_err_code

def test_create_delete_food():
    # Give a valid gymId
    userId = "699d0093795741a59fe13616"
    name = "Lettuce"
    calsPerServing = 0
    servings = 99
    type = "Snack"
    time = 0
    responseId, err = FoodDriver.create_food(userId, name, calsPerServing, servings, type, time)

    print("***", responseId, err)

    if err is not None:
        print(responseId, err)
        
    # Check if response is valid id
    try:
        responseObj = ObjectId(str(responseId))
    except (bson_errors.InvalidId, TypeError, ValueError):
        assert(False)

    # Give created gymId
    food, err = FoodDriver.get_food_by_id(responseId)

    if err is not None:
        print(food, err)

    # Assertions
    assert err is None
    assert food is not None
    assert food.get("_id") == responseId
    assert food.get("userId") == "699d0093795741a59fe13616"
    assert food.get("name") == "Lettuce"
    assert food.get("calsPerServing") == 0
    assert food.get("servings") == 99
    assert food.get("type") == "Snack"
    assert food.get("time") == 0

    # Delete created gym
    response, err = FoodDriver.delete_food(responseId)
    if err is not None:
        print(response, err)
    # Assertions
    assert response == responseId

# Gym

def test_find_gym_by_id():
    # Give a valid gymId
    oid = "699cff88400d9d43a32e924d"
    gym, err = GymDriver.get_gym_by_id(oid)

    if err is not None:
        print(gym, err)

    # Assertions
    assert err is None
    assert gym is not None
    assert gym.get("_id") == oid
    assert gym.get("name") == "Downtown Fitness"
    assert gym.get("address") == "123 Main St, Anytown, USA"
    assert gym.get("cost") == 49.99
    assert gym.get("link") == "https://examplegym.com"

    # Give a bad gymId
    bad_oid = "699cff88400d9d43a32e924"
    gym, err = GymDriver.get_gym_by_id(bad_oid)

    if err is not None:
        print(gym, err)

    # Expected
    bad_err_code = "\'" + bad_oid + "\' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
    
    # Assertions
    assert gym is None
    assert err == bad_err_code

    # Give an invalid gymId
    inv_oid = "000000000000000000000000"
    gym, err = GymDriver.get_gym_by_id(inv_oid)

    if err is not None:
        print(gym, err)

    # Expected
    inv_err_code = "Gym not found"
    
    # Assertions
    assert gym is None
    assert err == inv_err_code    

def test_create_delete_gym():
    # Give a valid gymId
    name = "A test Gym, you shouldnt see this"
    address = "Hell"
    type = "General"
    cost = 0.0
    link = "www.testgym.com"
    lat = 1
    long = 2
    notes = "test"
    responseId, err = GymDriver.create_gym(name, address, type, cost, link, lat, long, notes)

    print("Response: ", responseId)

    if err is not None:
        print(responseId, err)

    # Check if response is valid id
    try:
        responseObj = ObjectId(str(responseId))
    except (bson_errors.InvalidId, TypeError, ValueError):
        assert(False)

    # Give created gymId
    gym, err = GymDriver.get_gym_by_id(responseId)

    if err is not None:
        print(gym, err)

    # Assertions
    assert err is None
    assert gym is not None
    assert gym.get("_id") == responseId
    assert gym.get("name") == "A test Gym, you shouldnt see this"
    assert gym.get("address") == "Hell"
    assert gym.get("cost") == 0.0
    assert gym.get("link") == "www.testgym.com"

    # Delete created gym
    response, err = GymDriver.delete_gym(responseId)
    if err is not None:
        print(response, err)
    # Assertions
    assert response == responseId

# Personal Ex

def test_find_personal_ex_by_id():
    # Give a valid _id
    oid = "69ab5596dc5dee4f518a01cd"
    ex, err = PersonalExDriver.get_personal_ex_by_id(oid)

    if err is not None:
        print(ex, err)

    # Assertions
    assert err is None
    assert ex is not None
    assert ex.get("_id") == oid
    assert ex.get("complete") == False
    assert ex.get("distance") == "0"
    assert ex.get("duration") == 120
    assert ex.get("exerciseId") == "69ab3627a819c7ed3f7fcab1"
    assert ex.get("reps") == 0
    assert ex.get("sets") == 0
    assert ex.get("userId") == "699d0093795741a59fe13616"
    assert ex.get("weight") == "150"
    assert ex.get("workoutId") == "699d05d8f1677119323250bc"

    # Give a bad _id
    bad_oid = "69ab5596dc5dee4f518a01c"
    ex, err = PersonalExDriver.get_personal_ex_by_id(bad_oid)

    if err is not None:
        print(ex, err)

    # Expected
    bad_err_code = "\'" + bad_oid + "\' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
    
    # Assertions
    assert ex is None
    assert err == bad_err_code

    # Give an invalid _id
    inv_oid = "000000000000000000000000"
    ex, err = PersonalExDriver.get_personal_ex_by_id(inv_oid)

    if err is not None:
        print(ex, err)

    # Expected
    inv_err_code = "PersonalEx not found"
    
    # Assertions
    assert ex is None
    assert err == inv_err_code 

def test_find_personal_ex_by_workout():
    # Give a valid _id
    oid = "699d05d8f1677119323250bc"
    exs, err = PersonalExDriver.get_personal_exs_by_workout(oid)

    if err is not None:
        print(exs, err)
    
    pe_oid = "69ab5596dc5dee4f518a01cd"
    filtered = [d for d in exs if d.get("_id") == pe_oid]

    assert len(filtered) == 1

    # Assertions
    assert err is None
    assert filtered[0] is not None
    assert filtered[0].get("_id") == pe_oid
    assert filtered[0].get("complete") == False
    assert filtered[0].get("distance") == "0"
    assert filtered[0].get("duration") == 120
    assert filtered[0].get("exerciseId") == "69ab3627a819c7ed3f7fcab1"
    assert filtered[0].get("reps") == 0
    assert filtered[0].get("sets") == 0
    assert filtered[0].get("userId") == "699d0093795741a59fe13616"
    assert filtered[0].get("weight") == "150"
    assert filtered[0].get("workoutId") == "699d05d8f1677119323250bc"

    # Give a bad _id
    bad_oid = "699d05d8f1677119323250b"
    exs, err = PersonalExDriver.get_personal_exs_by_workout(bad_oid)

    if err is not None:
        print(exs, err)

    # Expected
    bad_err_code = "\'" + bad_oid + "\' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
    
    # Assertions
    assert exs is None
    assert err == bad_err_code

    # Give an invalid _id
    inv_oid = "000000000000000000000000"
    exs, err = PersonalExDriver.get_personal_exs_by_workout(inv_oid)

    if err is not None:
        print(exs, err)

    # Expected
    inv_err_code = "PersonalEx not found"
    
    # Assertions
    assert exs is None
    assert err == inv_err_code 

def test_find_personal_ex_by_user():
    # Give a valid _id
    oid = "699d0093795741a59fe13616"
    exs, err = PersonalExDriver.get_personal_exs_by_user(oid)

    if err is not None:
        print(exs, err)
    
    pe_oid = "69ab5596dc5dee4f518a01cd"
    filtered = [d for d in exs if d.get("_id") == pe_oid]

    assert len(filtered) == 1

    # Assertions
    assert err is None
    assert filtered[0] is not None
    assert filtered[0].get("_id") == pe_oid
    assert filtered[0].get("complete") == False
    assert filtered[0].get("distance") == "0"
    assert filtered[0].get("duration") == 120
    assert filtered[0].get("exerciseId") == "69ab3627a819c7ed3f7fcab1"
    assert filtered[0].get("reps") == 0
    assert filtered[0].get("sets") == 0
    assert filtered[0].get("userId") == "699d0093795741a59fe13616"
    assert filtered[0].get("weight") == "150"
    assert filtered[0].get("workoutId") == "699d05d8f1677119323250bc"

    # Give a bad _id
    bad_oid = "699d0093795741a59fe1361"
    exs, err = PersonalExDriver.get_personal_exs_by_user(bad_oid)

    if err is not None:
        print(exs, err)

    # Expected
    bad_err_code = "\'" + bad_oid + "\' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
    
    # Assertions
    assert exs is None
    assert err == bad_err_code

    # Give an invalid _id
    inv_oid = "000000000000000000000000"
    exs, err = PersonalExDriver.get_personal_exs_by_user(inv_oid)

    if err is not None:
        print(exs, err)

    # Expected
    inv_err_code = "PersonalEx not found"
    
    # Assertions
    assert exs is None
    assert err == inv_err_code 

def test_create_delete_personal_ex():
    # Give a valid gymId
    completed = False
    distance = "0"
    duration = 240
    exerciseId = "69ab3627a819c7ed3f7fcab1"
    workoutId = "699d05d8f1677119323250bc"
    reps = 0
    sets = 0
    userId = "699d0093795741a59fe13616"
    weight = 600
    responseId, err = PersonalExDriver.create_personal_ex(userId, exerciseId, workoutId, reps, sets, weight, duration, distance, completed)

    if err is not None:
        print(responseId, err)

    # Check if response is valid id
    try:
        responseObj = ObjectId(str(responseId))
    except (bson_errors.InvalidId, TypeError, ValueError):
        assert(False)

    # Give created gymId
    personalEx, err = PersonalExDriver.get_personal_ex_by_id(responseId)

    if err is not None:
        print(personalEx, err)

    # Assertions
    assert err is None
    assert personalEx is not None
    assert personalEx.get("_id") == responseId
    assert personalEx.get("complete") == False
    assert personalEx.get("distance") == "0"
    assert personalEx.get("duration") == 240
    assert personalEx.get("exerciseId") == "69ab3627a819c7ed3f7fcab1"
    assert personalEx.get("reps") == 0
    assert personalEx.get("sets") == 0
    assert personalEx.get("userId") == "699d0093795741a59fe13616"
    assert personalEx.get("weight") == 600

    # Delete created gym
    response, err = PersonalExDriver.delete_personal_ex(responseId)
    if err is not None:
        print(response, err)
    # Assertions
    assert response == responseId

# User

def test_find_user_by_id():
    # Give a valid gymId
    oid = "699d0093795741a59fe13616"
    user, err = UserDriver.get_user_by_id(oid)

    if err is not None:
        print(user, err)

    # Assertions
    assert err is None
    assert user is not None
    assert user.get("_id") == oid
    assert user.get("name") == "Test User"
    assert user.get("email") == "test@email.com"
    assert user.get("picture") == "pic.png"
    assert user.get("last_login_time") == 1000000000
    assert user.get("last_login_expire") == 1000000009
    assert user.get("magic_bits") == "010101010101010101010101010101_0"

    # Give a bad userId
    bad_oid = "699d0093795741a59fe1361"
    user, err = UserDriver.get_user_by_id(bad_oid)

    if err is not None:
        print(user, err)

    # Expected
    bad_err_code = "\'" + bad_oid + "\' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
    
    # Assertions
    assert user is None
    assert err == bad_err_code

    # Give an invalid userId
    inv_oid = "000000000000000000000000"
    user, err = UserDriver.get_user_by_id(inv_oid)

    if err is not None:
        print(user, err)

    # Expected
    inv_err_code = "User not found"
    
    # Assertions
    assert user is None
    assert err == inv_err_code

def test_find_user_by_email():
    # Give a valid email
    email = "test@email.com"
    user, err = UserDriver.get_user_by_email(email)

    if err is not None:
        print(user, err)

    # Assertions
    assert err is None
    assert user is not None
    assert user.get("_id") == "699d0093795741a59fe13616"
    assert user.get("name") == "Test User"
    assert user.get("email") == email
    assert user.get("picture") == "pic.png"
    assert user.get("last_login_time") == 1000000000
    assert user.get("last_login_expire") == 1000000009
    assert user.get("magic_bits") == "010101010101010101010101010101_0"

    # Give an empty email
    inv_email = ""
    user, err = UserDriver.get_user_by_email(inv_email)

    if err is not None:
        print(user, err)

    # Expected
    inv_err_code = "User not found"
    
    # Assertions
    assert user is None
    assert err == inv_err_code
    
# TO DO    
# def test_create_user():
#     pass

# def test_user_roles():
#     pass

# Workout

def test_find_workout_by_id():
    # Give a valid _id
    oid = "69af2a4598d0f4227b25ed71"
    ex, err = WorkoutDriver.get_workout_by_id(oid)

    if err is not None:
        print(ex, err)

    # Assertions
    assert err is None
    assert ex is not None
    assert ex.get("_id") == oid
    assert ex.get("userId") == "699d0093795741a59fe13616"
    assert ex.get("gymId") == "699cff88400d9d43a32e924d"
    assert ex.get("title") == "A test workout"
    assert ex.get("startTime") == 1
    assert ex.get("endTime") == 2

    # Give a bad _id
    bad_oid = "69af2a4598d0f4227b25ed7"
    ex, err = WorkoutDriver.get_workout_by_id(bad_oid)

    if err is not None:
        print(ex, err)

    # Expected
    bad_err_code = "\'" + bad_oid + "\' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
    
    # Assertions
    assert ex is None
    assert err == bad_err_code

    # Give an invalid _id
    inv_oid = "000000000000000000000000"
    ex, err = WorkoutDriver.get_workout_by_id(inv_oid)

    if err is not None:
        print(ex, err)

    # Expected
    inv_err_code = "Workout not found"
    
    # Assertions
    assert ex is None
    assert err == inv_err_code 

def test_find_workout_by_user():
    # Give a valid _id
    oid = "699d0093795741a59fe13616"
    exs, err = WorkoutDriver.get_workouts_by_user(oid)

    if err is not None:
        print(exs, err)
    
    wo_oid = "69af2a4598d0f4227b25ed71"
    filtered = [d for d in exs if d.get("_id") == wo_oid]

    assert len(filtered) == 1

    # Assertions
    assert err is None
    assert filtered[0] is not None
    assert filtered[0].get("_id") == wo_oid
    assert filtered[0].get("userId") == "699d0093795741a59fe13616"
    assert filtered[0].get("gymId") == "699cff88400d9d43a32e924d"
    assert filtered[0].get("title") == "A test workout"
    assert filtered[0].get("startTime") == 1
    assert filtered[0].get("endTime") == 2

    # Give a bad _id
    bad_oid = "699d0093795741a59fe1361"
    exs, err = WorkoutDriver.get_workouts_by_user(bad_oid)

    if err is not None:
        print(exs, err)

    # Expected
    bad_err_code = "\'" + bad_oid + "\' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
    
    # Assertions
    assert exs is None
    assert err == bad_err_code

    # Give an invalid _id
    inv_oid = "000000000000000000000000"
    exs, err = WorkoutDriver.get_workouts_by_user(inv_oid)

    if err is not None:
        print(exs, err)

    # Expected
    inv_err_code = "Workout not found"
    
    # Assertions
    assert exs is None
    assert err == inv_err_code 

def test_find_template_by_user():
    # Give a valid _id
    oid = "699d0093795741a59fe13616"
    temps, err = WorkoutDriver.get_templates(oid)

    if err is not None:
        print(temps, err)
    
    tp_oid = "69af2d76938739819748be48"
    filtered = [d for d in temps if d.get("_id") == tp_oid]

    assert len(filtered) == 1

    # Assertions
    assert err is None
    assert filtered[0] is not None
    assert filtered[0].get("_id") == tp_oid
    assert filtered[0].get("userId") == "699d0093795741a59fe13616"
    assert filtered[0].get("title") == "A workout template"
    assert filtered[0].get("template") == "True"
    assert filtered[0].get("startTime") == 0

    # Give a bad _id
    bad_oid = "699d0093795741a59fe1361"
    temps, err = WorkoutDriver.get_templates(bad_oid)

    if err is not None:
        print(temps, err)

    # Expected
    bad_err_code = "\'" + bad_oid + "\' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
    
    # Assertions
    assert temps is None
    assert err == bad_err_code

    # Give an invalid _id
    inv_oid = "000000000000000000000000"
    temps, err = WorkoutDriver.get_templates(inv_oid)

    if err is not None:
        print(temps, err)

    # Expected
    inv_err_code = "Templates not found"
    
    # Assertions
    assert temps is None
    assert err == inv_err_code 

def test_create_delete_workout():
    # Give a valid gymId
    gymId = "699cff88400d9d43a32e924d"
    startTime = "1"
    endTime = "2"
    title = "A test workout"
    userId = "699d0093795741a59fe13616"
    responseId, err = WorkoutDriver.create_workout(userId, gymId, title, startTime, endTime)

    if err is not None:
        print(responseId, err)

    # Check if response is valid id
    try:
        responseObj = ObjectId(str(responseId))
    except (bson_errors.InvalidId, TypeError, ValueError):
        assert(False)

    # Give created workoutId
    workout, err = WorkoutDriver.get_workout_by_id(responseId)

    if err is not None:
        print(workout, err)

    # Assertions
    assert err is None
    assert workout is not None
    assert workout.get("_id") == responseId
    assert workout.get("gymId") == "699cff88400d9d43a32e924d"
    assert workout.get("startTime") == 1
    assert workout.get("endTime") == 2
    assert workout.get("userId") == "699d0093795741a59fe13616"
    
    # Delete created gym
    response, err = WorkoutDriver.delete_workout(responseId)
    if err is not None:
        print(response, err)
    # Assertions
    assert response == responseId

def test_create_delete_template():
    # Give a valid gymId
    title = "A test template"
    userId = "699d0093795741a59fe13616"
    responseId, err = WorkoutDriver.create_template(userId, title)

    if err is not None:
        print(responseId, err)

    # Check if response is valid id
    try:
        responseObj = ObjectId(str(responseId))
    except (bson_errors.InvalidId, TypeError, ValueError):
        assert(False)

    # Give created workoutId
    templates, err = WorkoutDriver.get_templates(userId)

    if err is not None:
        print(templates, err)

    filtered = [d for d in templates if d.get("_id") == responseId]

    # Assertions
    assert err is None
    assert filtered is not None
    assert filtered[0].get("_id") == responseId
    assert filtered[0].get("startTime") == 0
    assert filtered[0].get("userId") == "699d0093795741a59fe13616"
    assert filtered[0].get("title") == "A test template"
    assert filtered[0].get("template") == "True"
    
    # Delete created template
    response, err = WorkoutDriver.delete_workout(responseId)
    if err is not None:
        print(response, err)
    # Assertions
    assert response == responseId
