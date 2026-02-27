
import os
import requests
from bson import ObjectId, errors as bson_errors
from Services.GymDriver import GymDriver
from Services.UserDriver import UserDriver
from Services.FoodDriver import FoodDriver

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
    assert gym.get("title") == "Downtown Fitness"
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

def test_create_gym():
    # Give a valid gymId
    title = "A test Gym, you shouldnt see this"
    address = "Hell"
    cost = 0.0
    link = "www.testgym.com"
    responseId, err = GymDriver.create_gym(title, address, cost, link)

    if err is not None:
        print(response, err)

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
    assert gym.get("title") == "A test Gym, you shouldnt see this"
    assert gym.get("address") == "Hell"
    assert gym.get("cost") == 0.0
    assert gym.get("link") == "www.testgym.com"

    # Delete created gym
    response, err = GymDriver.delete_gym(responseId)
    if err is not None:
        print(response, err)
    # Assertions
    assert response == responseId

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
    assert user.get("role") == 0

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
    assert user.get("role") == 0

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
    food, err = FoodDriver.get_food_by_id(oid)

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
    assert False

def test_find_food_by_user():
    # Give a valid email
    userId = "699d0093795741a59fe13616"
    food, err = FoodDriver.get_food_by_user(userId)

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
    assert False
