
import os
import requests
from bson import ObjectId, errors as bson_errors
from Services.GymDriver import GymDriver


def test_wont_fail():
    assert True

# def test_wont_pass():
#     assert False


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
    oid = "699cff88400d9d43a32e924d"
    title = "A test Gym"
    address = "Hell"
    cost = 0.0
    link = "www.testgym.com"
    response, err = GymDriver.create_gym(title, address, cost, link)

    if err is not None:
        print(response, err)

    # Check if response is valid id
    try:
        responseObj = ObjectId(str(response))
    except (bson_errors.InvalidId, TypeError, ValueError):
        assert(False)

    # Give created gymId
    gym, err = GymDriver.get_gym_by_id(response)

    if err is not None:
        print(gym, err)

    # Assertions
    assert err is None
    assert gym is not None
    assert gym.get("_id") == response
    assert gym.get("title") == "A test Gym"
    assert gym.get("address") == "Hell"
    assert gym.get("cost") == 0.0
    assert gym.get("link") == "www.testgym.com"
    
