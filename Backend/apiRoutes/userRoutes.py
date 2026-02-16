from flask import Blueprint, request, jsonify
from services.userDriver import UserDriver

userRouteBlueprint = Blueprint("users", __name__, url_prefix="/AHFULusers")

# ── GET all users ─────────────────────────────────────────────────────────────
@userRouteBlueprint.route("/", methods=["GET"])
def get_all_users():
    users, error = UserDriver.get_all_users()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(users), 200

# ── GET single user ───────────────────────────────────────────────────────────
@userRouteBlueprint.route("/<email>", methods=["GET"])
def get_user(email):
    user, error = UserDriver.get_user_by_email(email)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(user), 200


# ── REGISTER ──────────────────────────────────────────────────────────────────
@userRouteBlueprint.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    print("data: ", data)
    if not data:
        return jsonify({"error": "No data provided"}), 400

    email, error = UserDriver.register_user(
        name=data.get("name"),
        email=data.get("email"),
        password=data.get("password"),
        role=data.get("role"),
    )
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"email": email, "message": "User created successfully"}), 201


# ── LOGIN ─────────────────────────────────────────────────────────────────────
@userRouteBlueprint.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    email, error = UserDriver.authenticate_user(
        email=data.get("email"),
        password=data.get("password"),
    )
    if error:
        return jsonify({"error": error}), 401
    return jsonify({"email": email, "message": "Login successful"}), 200


##NOT TESTED YET — MAYBE NOT NEEDED DEPENDING ON FRONTEND DESIGN, BUT HERE FROM AI
# ── UPDATE user ───────────────────────────────────────────────────────────────
@userRouteBlueprint.route("/<email>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    updated, error = UserDriver.update_user(user_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "User updated successfully"}), 200

##NOT TESTED YET — MAYBE NOT NEEDED DEPENDING ON FRONTEND DESIGN, BUT HERE FROM AI
##TODO DETERMINE HOW TO HANDLE USER ID AT DB LEVEL?
# ── DELETE user ───────────────────────────────────────────────────────────────
@userRouteBlueprint.route("/<email>", methods=["DELETE"])
def delete_user(user_id):
    deleted, error = UserDriver.delete_user(user_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "User deleted successfully"}), 200