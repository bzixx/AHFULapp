from flask import Blueprint, jsonify, request, g
from Auth.verification import verify_user_login, verify_user_developer, verify_user_admin

from Services.MeasurementDriver import MeasurementDriver

measurementRouteBlueprint = Blueprint("measurements", __name__, url_prefix="/AHFULmeasurements")

# Get all measurements
@measurementRouteBlueprint.route("/", methods=["GET"])
@verify_user_developer
def get_all_measurements():
    measurements, error = MeasurementDriver.get_all_measurements()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(measurements), 200

# Get measurement by user id
@measurementRouteBlueprint.route("/<user_id>", methods=["GET"])
@verify_user_login
def get_measurements_by_user(user_id):
    if (user_id != g.user_id) and (g.role != "Developer") and (g.role != "Admin"):
        return jsonify({"error": "You may only access your own data"}), 403
    measurements, error = MeasurementDriver.get_measurements_by_user(user_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(measurements), 200

# Get measurement by id
@measurementRouteBlueprint.route("/id/<measurement_id>", methods=["GET"])
@verify_user_developer
def get_measurement_by_id(measurement_id):
    measurement, error = MeasurementDriver.get_measurement_by_id(measurement_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(measurement), 200

# Create new measurement
@measurementRouteBlueprint.route("/create", methods=["POST"])
@verify_user_login
def create_measurement():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    measurement_id, error = MeasurementDriver.create_measurement(
        user_id=data.get("user_id"),
        data=data,
    )

    if error:
        return jsonify({"error": error}), 400
    return jsonify({"measurement_id": measurement_id, "message": "Measurement created"}), 201

# Update measurement by id
@measurementRouteBlueprint.route("/update/<measurement_id>", methods=["PUT"])
@verify_user_login
def update_measurement(measurement_id):
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "You must provide a JSON body with at least one field to update"}), 400

    res, err = MeasurementDriver.verify_operation(g.user_id, measurement_id)
    if err:
        return jsonify({"error": err}), 400

    updated, error = MeasurementDriver.update_measurement(measurement_id, data)
    if error:
        if "not found" in error.lower():
            return jsonify({"error": error}), 404
        return jsonify({"error": error}), 400
    return jsonify(updated), 200

# Delete measurement by id
@measurementRouteBlueprint.route("/delete/<measurement_id>", methods=["DELETE"])
@verify_user_login
def delete_measurement(measurement_id):
    res, err = MeasurementDriver.verify_operation(g.user_id, measurement_id)
    if err:
        return jsonify({"error": err}), 400
    
    response, error = MeasurementDriver.delete_measurement(measurement_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Measurement deleted", "measurement_id": response}), 200
