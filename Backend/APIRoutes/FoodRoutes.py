from flask import Blueprint, request, jsonify
from Services.FoodDriver import FoodDriver

foodRouteBlueprint = Blueprint("food", __name__, url_prefix="/AHFULfood")


# ── GET all foods ────────────────────────────
@foodRouteBlueprint.route("/", methods=["GET"])
def get_all_food():
    food, error = FoodDriver.get_all_food()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(food), 200


# ── GET single food ────────────────────────────────────────────────────────────
@foodRouteBlueprint.route("/<user_id>", methods=["GET"])
def get_food_by_user(user_id):
    food, error = FoodDriver.get_food_by_user(user_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(food), 200

@foodRouteBlueprint.route("/id/<id>", methods=["GET"])
def get_food_by_id(id):
    food, error = FoodDriver.get_food_by_id(id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(food), 200

# ── CREATE food ────────────────────────────────────────────────────────────────
@foodRouteBlueprint.route("/create", methods=["POST"])
def create_food():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    food_id, error = FoodDriver.create_food(
        userId=data.get("userId"),
        name=data.get("name"),
        calsPerServing=data.get("calsPerServing"),
        servings=data.get("servings"),
        type=data.get("type"),
        time=data.get("time")
    )
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"food_id": food_id, "message": "food created"}), 201

# ── DELETE gym ────────────────────────────────────────────────────────────────
@foodRouteBlueprint.route("/delete/<food_id>", methods=["DELETE"])
def delete_food(food_id):
    if not food_id:
        return jsonify({"error": "You must provide a food id to delete"}), 400

    response, error = FoodDriver.delete_food(food_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Food deleted", "food_id": response}), 200
