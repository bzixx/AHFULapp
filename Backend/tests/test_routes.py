
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
    gym = GymDriver.get_gym_by_id(oid)
    print(gym)
    assert gym is not None
