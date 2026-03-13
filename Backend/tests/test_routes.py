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

def test_update_food_roundtrip():
    # Known existing document id from your tests/fixtures
    food_id = "699d0f5f888d8f649698307e"

    # Fetch the current/original state
    original, err = FoodDriver.get_food_by_id(food_id)
    if err is not None:
        print("Fetch original failed:", err)
    assert err is None
    assert original is not None
    assert original.get("_id") == food_id

    # Keep a copy of original values for roundtrip restore
    orig_userId = original.get("userId")
    orig_name = original.get("name")
    orig_calsPerServing = original.get("calsPerServing")
    orig_servings = original.get("servings")
    orig_type = original.get("type")
    orig_time = original.get("time")

    # Sanity checks (aligns with your existing expectations)
    assert isinstance(orig_name, str)
    assert isinstance(orig_calsPerServing, int)
    assert isinstance(orig_servings, int)
    assert isinstance(orig_type, str)
    assert isinstance(orig_time, int)

    # Update all allowed fields to new values
    new_name = "Banana"
    new_calsPerServing = 105
    new_servings = 2
    new_type = "Snack"
    new_time = 1708473602 

    updated, err = FoodDriver.update_food(
        food_id=food_id,
        name=new_name,
        calsPerServing=new_calsPerServing,
        servings=new_servings,
        type=new_type,
        time=new_time
    )
    if err is not None:
        print("Update failed:", err)
    assert err is None
    assert updated is not None
    assert updated.get("_id") == food_id

    # Assert updated values persisted (and userId unchanged)
    assert updated.get("userId") == orig_userId
    assert updated.get("name") == new_name
    assert updated.get("calsPerServing") == new_calsPerServing
    assert updated.get("servings") == new_servings
    assert updated.get("type") == new_type
    assert updated.get("time") == new_time

    # Re-fetch from DB to ensure it wasn't just an in-memory return
    fetched_after_update, err = FoodDriver.get_food_by_id(food_id)
    if err is not None:
        print("Fetch after update failed:", err)
    assert err is None
    assert fetched_after_update is not None
    assert fetched_after_update.get("_id") == food_id

    # Assert values are exactly as updated
    assert fetched_after_update.get("userId") == orig_userId
    assert fetched_after_update.get("name") == new_name
    assert fetched_after_update.get("calsPerServing") == new_calsPerServing
    assert fetched_after_update.get("servings") == new_servings
    assert fetched_after_update.get("type") == new_type
    assert fetched_after_update.get("time") == new_time

    # Restore the original values
    restored, err = FoodDriver.update_food(
        food_id=food_id,
        name=orig_name,
        calsPerServing=orig_calsPerServing,
        servings=orig_servings,
        type=orig_type,
        time=orig_time
    )
    if err is not None:
        print("Restore failed:", err)
    assert err is None
    assert restored is not None
    assert restored.get("_id") == food_id

    # Assert restored document reflects the original values
    assert restored.get("userId") == orig_userId
    assert restored.get("name") == orig_name
    assert restored.get("calsPerServing") == orig_calsPerServing
    assert restored.get("servings") == orig_servings
    assert restored.get("type") == orig_type
    assert restored.get("time") == orig_time

    # Re-fetch to ensure final state is restored in DB
    fetched_after_restore, err = FoodDriver.get_food_by_id(food_id)
    if err is not None:
        print("Fetch after restore failed:", err)
    assert err is None
    assert fetched_after_restore is not None
    assert fetched_after_restore.get("_id") == food_id

    assert fetched_after_restore.get("userId") == orig_userId
    assert fetched_after_restore.get("name") == orig_name
    assert fetched_after_restore.get("calsPerServing") == orig_calsPerServing
    assert fetched_after_restore.get("servings") == orig_servings
    assert fetched_after_restore.get("type") == orig_type
    assert fetched_after_restore.get("time") == orig_time

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

def test_update_gym_roundtrip():
    gym_id = "699cff88400d9d43a32e924d"  # replace with a known existing id in your test DB

    # Fetch current/original state
    original, err = GymDriver.get_gym_by_id(gym_id)
    if err is not None:
        print("Fetch original gym failed:", err)
    assert err is None
    assert original is not None
    assert original.get("_id") == gym_id

    # Keep original values for restore
    orig_name    = original.get("name")
    orig_address = original.get("address")
    orig_cost    = original.get("cost")
    orig_link    = original.get("link")
    orig_lat     = original.get("lat")
    orig_lng     = original.get("lng")
    orig_notes   = original.get("notes")

    # Update all allowed fields
    new_values = {
        "name":    "Test Gym",
        "address": "456 Main St, Testville, USA",
        "cost":    19.99,
        "link":    "https://gym.example.com",
        "lat":     44.1234,
        "lng":     -91.5678,
        "notes":   "Test roundtrip"
    }
    updated, err = GymDriver.update_gym(id=gym_id, updates=new_values)
    if err is not None:
        print("Update gym failed:", err)
    assert err is None
    assert updated is not None
    assert updated.get("_id") == gym_id

    # Assert fields updated
    assert updated.get("name") == new_values["name"]
    assert updated.get("address") == new_values["address"]
    assert updated.get("cost") == new_values["cost"]
    assert updated.get("link") == new_values["link"]
    assert updated.get("lat") == new_values["lat"]
    assert updated.get("lng") == new_values["lng"]
    assert updated.get("notes") == new_values["notes"]

    # Re-fetch to confirm persistence
    fetched_after_update, err = GymDriver.get_gym_by_id(gym_id)
    if err is not None:
        print("Fetch after update failed:", err)
    assert err is None
    assert fetched_after_update is not None
    assert fetched_after_update.get("_id") == gym_id

    assert fetched_after_update.get("name") == new_values["name"]
    assert fetched_after_update.get("address") == new_values["address"]
    assert fetched_after_update.get("cost") == new_values["cost"]
    assert fetched_after_update.get("link") == new_values["link"]
    assert fetched_after_update.get("lat") == new_values["lat"]
    assert fetched_after_update.get("lng") == new_values["lng"]
    assert fetched_after_update.get("notes") == new_values["notes"]

    # Restore original values
    restore_payload = {
        "name":    orig_name,
        "address": orig_address,
        "cost":    orig_cost,
        "link":    orig_link,
        "lat":     orig_lat,
        "lng":     orig_lng,
        "notes":   orig_notes
    }
    restored, err = GymDriver.update_gym(id=gym_id, updates=restore_payload)
    if err is not None:
        print("Restore gym failed:", err)
    assert err is None
    assert restored is not None
    assert restored.get("_id") == gym_id

    # Assert restored to original
    assert restored.get("name") == orig_name
    assert restored.get("address") == orig_address
    assert restored.get("cost") == orig_cost
    assert restored.get("link") == orig_link
    assert restored.get("lat") == orig_lat
    assert restored.get("lng") == orig_lng
    assert restored.get("notes") == orig_notes

    # Re-fetch to confirm final persistence
    fetched_after_restore, err = GymDriver.get_gym_by_id(gym_id)
    if err is not None:
        print("Fetch after restore failed:", err)
    assert err is None
    assert fetched_after_restore is not None
    assert fetched_after_restore.get("_id") == gym_id

    assert fetched_after_restore.get("name") == orig_name
    assert fetched_after_restore.get("address") == orig_address
    assert fetched_after_restore.get("cost") == orig_cost
    assert fetched_after_restore.get("link") == orig_link
    assert fetched_after_restore.get("lat") == orig_lat
    assert fetched_after_restore.get("lng") == orig_lng
    assert fetched_after_restore.get("notes") == orig_notes

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
   
def test_update_personal_ex_roundtrip():
    personal_ex_id = "69ab5596dc5dee4f518a01cd"

    original, err = PersonalExDriver.get_personal_ex_by_id(personal_ex_id)
    if err is not None:
        print("Fetch original failed:", err)
    assert err is None
    assert original is not None
    assert original.get("_id") == personal_ex_id

    orig_reps      = original.get("reps")
    orig_sets      = original.get("sets")
    orig_weight    = original.get("weight")
    orig_duration  = original.get("duration")
    orig_distance  = original.get("distance")
    orig_complete  = original.get("complete")

    new_values = {
        "reps": 999,
        "sets": 999,
        "weight": "999",    
        "duration": 999,    
        "distance": "999",  
        "complete": True
    }

    updated, err = PersonalExDriver.update_personal_ex(id=personal_ex_id, updates=new_values)

    if err is not None:
        print("Update failed:", err)

    assert err is None
    assert updated is not None
    assert updated.get("_id") == personal_ex_id

    assert updated.get("reps") == new_values["reps"]
    assert updated.get("sets") == new_values["sets"]
    assert updated.get("weight") == new_values["weight"]
    assert updated.get("duration") == new_values["duration"]
    assert updated.get("distance") == new_values["distance"]
    assert updated.get("complete") == new_values["complete"]

    fetched_after_update, err = PersonalExDriver.get_personal_ex_by_id(personal_ex_id)
    if err is not None:
        print("Fetch after update failed:", err)
    assert err is None
    assert fetched_after_update is not None
    assert fetched_after_update.get("_id") == personal_ex_id

    # Assert values are exactly as updated
    assert fetched_after_update.get("reps") == new_values["reps"]
    assert fetched_after_update.get("sets") == new_values["sets"]
    assert fetched_after_update.get("weight") == new_values["weight"]
    assert fetched_after_update.get("duration") == new_values["duration"]
    assert fetched_after_update.get("distance") == new_values["distance"]
    assert fetched_after_update.get("complete") == new_values["complete"]

    restore = {
        "reps": orig_reps,
        "sets": orig_sets,
        "weight": orig_weight,
        "duration": orig_duration,
        "distance": orig_distance,
        "complete": orig_complete
    }
    restored, err = PersonalExDriver.update_personal_ex(id=personal_ex_id, updates=restore)
    if err is not None:
        print("Restore failed:", err)
    assert err is None
    assert restored is not None
    assert restored.get("_id") == personal_ex_id

    # Assert restored document reflects the original values
    assert restored.get("reps") == orig_reps
    assert restored.get("sets") == orig_sets
    assert restored.get("weight") == orig_weight
    assert restored.get("duration") == orig_duration
    assert restored.get("distance") == orig_distance
    assert restored.get("complete") == orig_complete

    fetched_after_restore, err = PersonalExDriver.get_personal_ex_by_id(personal_ex_id)
    if err is not None:
        print("Fetch after restore failed:", err)
    assert err is None
    assert fetched_after_restore is not None
    assert fetched_after_restore.get("_id") == personal_ex_id

    assert fetched_after_restore.get("reps") == orig_reps
    assert fetched_after_restore.get("sets") == orig_sets
    assert fetched_after_restore.get("weight") == orig_weight
    assert fetched_after_restore.get("duration") == orig_duration
    assert fetched_after_restore.get("distance") == orig_distance
    assert fetched_after_restore.get("complete") == orig_complete

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

def test_add_remove_role_by_id_roundtrip():
    user_id = "699f79574048f9ec8b5b0ed3"
    adder_id = "699d0093795741a59fe13616"
    test_role = "Gym Owner"

    # Fetch current/original state
    user, err = UserDriver.get_user_by_id(user_id)
    if err is not None:
        print("Fetch original user failed:", err)
    assert err is None
    assert user is not None
    assert user.get("_id") == user_id

    # Add the test role via the driver
    updated_user, err = UserDriver.add_role_by_id(user_id=user_id, adder_id=adder_id, role=test_role)
    if err is not None:
        print("Add role failed:", err)
    assert err is None
    assert updated_user is not None
    assert test_role in updated_user.get("roles", [])

    # Re-fetch and verify role present
    fetched, err = UserDriver.get_user_by_id(user_id)
    assert err is None
    assert fetched is not None
    assert test_role in fetched.get("roles", [])

    # Remove the test role via the driver
    updated_user, err = UserDriver.remove_role_by_id(user_id=user_id, remover_id=adder_id, role=test_role)
    if err is not None:
        print("Remove role failed:", err)
    assert err is None
    assert updated_user is not None
    assert test_role not in updated_user.get("roles", [])

    # Re-fetch and verify role removed
    fetched_after, err = UserDriver.get_user_by_id(user_id)
    assert err is None
    assert fetched_after is not None
    assert test_role not in fetched_after.get("roles", [])

def test_add_remove_role_by_email_roundtrip():
    user_email = "jtboichipichipi@gmail.com"
    adder_id = "699d0093795741a59fe13616"
    test_role = "Gym Owner"

    # Fetch current/original state
    user, err = UserDriver.get_user_by_email(user_email)
    if err is not None:
        print("Fetch original user failed:", err)
    assert err is None
    assert user is not None
    assert user.get("email") == user_email

    # Add the test role via the driver
    updated_user, err = UserDriver.add_role_by_email(user_email=user_email, adder_id=adder_id, role=test_role)
    if err is not None:
        print("Add role failed:", err)
    assert err is None
    assert updated_user is not None
    assert test_role in updated_user.get("roles", [])

    # Re-fetch and verify role present
    fetched, err = UserDriver.get_user_by_email(user_email)
    assert err is None
    assert fetched is not None
    assert test_role in fetched.get("roles", [])

    # Remove the test role via the driver
    updated_user, err = UserDriver.remove_role_by_email(user_email=user_email, remover_id=adder_id, role=test_role)
    if err is not None:
        print("Remove role failed:", err)
    assert err is None
    assert updated_user is not None
    assert test_role not in updated_user.get("roles", [])

    # Re-fetch and verify role removed
    fetched_after, err = UserDriver.get_user_by_email(user_email)
    assert err is None
    assert fetched_after is not None
    assert test_role not in fetched_after.get("roles", [])

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
   
def test_update_workout_roundtrip():
    # Known existing document id from your tests/fixtures
    workout_id = "69af2a4598d0f4227b25ed71"

    original, err = WorkoutDriver.get_workout_by_id(workout_id)
    if err is not None:
        print("Fetch original failed:", err)
    assert err is None
    assert original is not None
    assert original.get("_id") == workout_id

    # Keep a copy of original values for roundtrip restore
    orig_title     = original.get("title")
    orig_startTime = original.get("startTime")
    orig_endTime   = original.get("endTime")

    new_values = {
        "title": "Updated Workout Title",
        "startTime": 10,
        "endTime": 20
    }
    updated, err = WorkoutDriver.update_workout(id=workout_id, updates=new_values)
    if err is not None:
        print("Update failed:", err)
    assert err is None
    assert updated is not None
    assert updated.get("_id") == workout_id

    # Assert updated values persisted
    assert updated.get("title") == new_values["title"]
    assert updated.get("startTime") == new_values["startTime"]
    assert updated.get("endTime") == new_values["endTime"]

    fetched_after_update, err = WorkoutDriver.get_workout_by_id(workout_id)
    if err is not None:
        print("Fetch after update failed:", err)
    assert err is None
    assert fetched_after_update is not None
    assert fetched_after_update.get("_id") == workout_id

    # Assert values are exactly as updated
    assert fetched_after_update.get("title") == new_values["title"]
    assert fetched_after_update.get("startTime") == new_values["startTime"]
    assert fetched_after_update.get("endTime") == new_values["endTime"]

    restore_payload = {
        "title": orig_title,
        "startTime": orig_startTime,
        "endTime": orig_endTime
    }
    restored, err = WorkoutDriver.update_workout(id=workout_id, updates=restore_payload)
    if err is not None:
        print("Restore failed:", err)
    assert err is None
    assert restored is not None
    assert restored.get("_id") == workout_id

    # Assert restored document reflects the original values
    assert restored.get("title") == orig_title
    assert restored.get("startTime") == orig_startTime
    assert restored.get("endTime") == orig_endTime

    fetched_after_restore, err = WorkoutDriver.get_workout_by_id(workout_id)
    if err is not None:
        print("Fetch after restore failed:", err)
    assert err is None
    assert fetched_after_restore is not None
    assert fetched_after_restore.get("_id") == workout_id

    assert fetched_after_restore.get("title") == orig_title
    assert fetched_after_restore.get("startTime") == orig_startTime
    assert fetched_after_restore.get("endTime") == orig_endTime

