
import os
import requests
from bson import ObjectId
from Services.GymDriver import GymDriver


def test_wont_fail():
    assert True

# def test_wont_pass():
#     assert False


def test_find_gym_by_id():
    oid = "699cff88400d9d43a32e924d"
    gym, err = GymDriver.get_gym_by_id(oid)

    if err is not None:
        print(gym, err)

    # Basic assertions
    assert err is None
    assert gym is not None

    # Assert values
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

    bad_err_code = "\'" + bad_oid + "\' is not a valid ObjectId, it must be a 12-byte input or a 24-character hex string"
    assert gym is None
    assert err == bad_err_code

    

