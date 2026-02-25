
import os
import requests

BASE = f"http://127.0.0.1:5000"

def test_get_personal_ex_by_id():
    doc_id = "698d07b26e5117c22dd7772e"
    
    url = f"{BASE}/AHFULpersonalEx/id/{doc_id}"
    resp = requests.get(url, timeout=15)

    assert resp.status_code == 200
    data = resp.json()
    assert data["_id"] == doc_id
