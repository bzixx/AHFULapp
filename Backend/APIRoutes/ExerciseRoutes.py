from flask import Blueprint, request, jsonify
from Services.ExerciseDriver import ExerciseDriver

exerciseRouteBlueprint = Blueprint("exercises", __name__,  url_prefix='/AHFULexercises')

# ── GET MetaData from Page 1 ───────────────────────────────────────────────────────
@exerciseRouteBlueprint.route("/metadata", methods=["GET"])
def get_initial_metadata():
    metadata, error = ExerciseDriver.get_initial_metadata()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(metadata), 200

# ── POST MetaData for next page from provided currentPage ───────────────────────────────────────────────────────
#PARAMETER search with value of "next" will go to next page Value of "prev" will go to previous page
@exerciseRouteBlueprint.route("/metadata", methods=["POST"])
def get_more_metadata():
    trueNext_falsePrev = request.args.get("search")
    providedPage = request.get_json()

    if trueNext_falsePrev is None:
        return jsonify({"error": "No search query provided"}), 400

    if trueNext_falsePrev == "next":
        metadata, error = ExerciseDriver.get_next_metadata(providedPage)
    elif trueNext_falsePrev == "prev":
        metadata, error = ExerciseDriver.get_prev_metadata(providedPage)
    else:
        return jsonify({"error": "Invalid search query"}), 400

    if error:
        return jsonify({"error": error}), 500
    return jsonify(metadata), 200

# ── GET All exercises from Page 1 ───────────────────────────────────────────────────────
@exerciseRouteBlueprint.route("/", methods=["GET"])
def get_initial_exercises():
    exercises, error = ExerciseDriver.get_initial_exercises()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(exercises), 200

# ── POST exercises for next page from provided currentPage ───────────────────────────────────────────────────────
#PARAMETER search with value of "next" will go to next page Value of "prev" will go to previous page
@exerciseRouteBlueprint.route("/", methods=["POST"])
def get_more_exercises():
    trueNext_falsePrev = request.args.get("search")
    providedPage = request.get_json()

    if trueNext_falsePrev is None:
        return jsonify({"error": "No search query provided"}), 400

    if trueNext_falsePrev == "next":
        metadata, error = ExerciseDriver.get_next_exercises(providedPage)
    elif trueNext_falsePrev == "prev":
        metadata, error = ExerciseDriver.get_prev_exercises(providedPage)
    else:
        return jsonify({"error": "Invalid search query"}), 400

    if error:
        return jsonify({"error": error}), 500
    return jsonify(metadata), 200

# ── GET single exercise ───────────────────────────────────────────────────────
@exerciseRouteBlueprint.route("/id/<exercise_id>", methods=["GET"])
def get_exercise(exercise_id):
    exercise, error = ExerciseDriver.get_exercise_by_id(exercise_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(exercise), 200
#
# ── GET exercise search ───────────────────────────────────────────────────────
@exerciseRouteBlueprint.route("/search", methods=["GET"])
def search_exercises():
    search_string = request.args.get("search")
    if not search_string:
        return jsonify({"error": "No search query provided"}), 400

    exercises, error = ExerciseDriver.search_exercises(search_string)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(exercises), 200

# ── CREATE exercise ───────────────────────────────────────────────────────────
@exerciseRouteBlueprint.route("/create/", methods=["POST"])
def create_exercise():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    exercise_id, error = ExerciseDriver.create_exercise(data)

    if error:
        return jsonify({"error": error}), 400
    return jsonify({"exercise_id": exercise_id, "message": "Exercise created"}), 201

# ── UPDATE exercise ───────────────────────────────────────────────────────────
@exerciseRouteBlueprint.route("/<exercise_id>", methods=["PUT"])
def update_exercise(exercise_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    updated, error = ExerciseDriver.update_exercise(exercise_id, data)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Exercise updated successfully"}), 200

# ── DELETE exercise ───────────────────────────────────────────────────────────
@exerciseRouteBlueprint.route("/delete/<exercise_id>", methods=["DELETE"])
def delete_exercise(exercise_id):
    deleted, error = ExerciseDriver.delete_exercise(exercise_id)
    if error:
        return jsonify({"error": error}), 400
    if not deleted:
        return jsonify({"error": "Exercise not found"}), 404
    else: 
        return jsonify({"error": "Exercise not deleted"}), 400

# ── GET bodyparts ───────────────────────────────────────────────────────────
@exerciseRouteBlueprint.route('/bodyparts/')
def get_bodyparts():
    data, error = ExerciseDriver.get_bodyparts()
    if error:
        return jsonify({"error": error}), 502
    return jsonify(data), 200

# ── GET muscles ──────────────────────────────────────────────────────────────
@exerciseRouteBlueprint.route('/muscles/')
def get_muscles():
    data, error = ExerciseDriver.get_muscles()
    if error:
        return jsonify({"error": error}), 502
    return jsonify(data), 200

# ── GET equipments ──────────────────────────────────────────────────────────
@exerciseRouteBlueprint.route('/equipments/')
def get_equipments():
    data, error = ExerciseDriver.get_equipments()
    if error:
        return jsonify({"error": error}), 502
    return jsonify(data), 200
