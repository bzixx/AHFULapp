from flask import Blueprint, request, jsonify, g
from Services.UserDriver import UserDriver
from Auth.verification import login_required_user, login_required_dev, login_required_admin, login_required_gym_owner

userRouteBlueprint = Blueprint("users", __name__, url_prefix="/AHFULusers")

# ── GET all users ──────────────────────────────────────────────────────────────
@userRouteBlueprint.route("/", methods=["GET"])
@login_required_admin
def get_all_users():
    users, error = UserDriver.get_all_users()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(users), 200

# ── GET single user by email───────────────────────────────────────────────────────────
@userRouteBlueprint.route("/<email>", methods=["GET"])
@login_required_admin
def get_user(email):
    user, error = UserDriver.get_user_by_email(email)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(user), 200

# ── GET single user by id ───────────────────────────────────────────────────────────
@userRouteBlueprint.route("/id/<id>", methods=["GET"])
@login_required_user
def get_user_id(user_id):
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    user, error = UserDriver.get_user_by_id(user_id)
    if error:
        if "not found" in error.lower():
            return jsonify({"error": error}), 404
        elif error:
            return jsonify({"error": error}), 400
    return jsonify(user), 200

# ── ADD role to user by id ───────────────────────────────────────────────────────────
@userRouteBlueprint.route("/add/role/id/", methods=["POST"])
@login_required_admin
def add_role_by_id():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    res, err = UserDriver.add_role_by_id(data.get("user_id"), g.user_id, g.role)
    if err: 
        return jsonify({"error": err}), 400
    return jsonify(res), 200

# ── ADD role to user by email ───────────────────────────────────────────────────────────
@userRouteBlueprint.route("/add/role/email/", methods=["POST"])
@login_required_admin
def add_role_by_email():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    res, err = UserDriver.add_role_by_email(data.get("user_email"), g.user_id, g.role)
    if err: 
        return jsonify({"error": err}), 400
    return jsonify(res), 200

# ── REMOVE role from user by id ───────────────────────────────────────────────────────────
@userRouteBlueprint.route("/remove/role/id/", methods=["POST"])
@login_required_admin
def remove_role_by_id():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    res, err = UserDriver.remove_role_by_id(data.get("user_id"), g.user_id, g.role)
    if err: 
        return jsonify({"error": err}), 400
    return jsonify(res), 200

# ── REMOVE role from user by email ───────────────────────────────────────────────────────────
@userRouteBlueprint.route("/remove/role/email/", methods=["POST"])
@login_required_admin
def remove_role_by_email():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    res, err = UserDriver.remove_role_by_email(data.get("user_email"), g.user_id, g.role)
    if err: 
        return jsonify({"error": err}), 400
    return jsonify(res), 200

# ── DEACTIVATE user by id ─────────────────────────────────────────────────────
@userRouteBlueprint.route("/deactivate/id/", methods=["POST"])
@login_required_admin
def deactivate_user_by_id():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    res, err = UserDriver.deactivate_user_by_id(g.user_id, data.get("deactivator_id"))
    if err:
        return jsonify({"error": err}), 400
    return jsonify(res), 200
