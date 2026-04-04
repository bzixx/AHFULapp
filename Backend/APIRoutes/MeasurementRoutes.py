from flask import Blueprint, jsonify, request

from Services.MeasurementDriver import MeasurementDriver

measurementRouteBlueprint = Blueprint("measurements", __name__, url_prefix="/AHFULmeasurements")

#Not Active in Prod. 
# @measurementRouteBlueprint.route("/", methods=["GET"])
# def get_all_measurements():
#     measurements, error = MeasurementDriver.get_all_measurements()
#     if error:
#         return jsonify({"error": error}), 500
#     return jsonify(measurements), 200


@measurementRouteBlueprint.route("/<user_id>", methods=["GET"])
def get_measurements_by_user(user_id):
    measurements, error = MeasurementDriver.get_measurements_by_user(user_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify(measurements), 200


@measurementRouteBlueprint.route("/id/<measurement_id>", methods=["GET"])
def get_measurement_by_id(measurement_id):
    measurement, error = MeasurementDriver.get_measurement_by_id(measurement_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(measurement), 200


@measurementRouteBlueprint.route("/create", methods=["POST"])
def create_measurement():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    measurement_id, error = MeasurementDriver.create_measurement(
        userId=data.get("userId"),
        data=data,
    )

    if error:
        return jsonify({"error": error}), 400
    return jsonify({"measurement_id": measurement_id, "message": "Measurement created"}), 201


@measurementRouteBlueprint.route("/update/<measurement_id>", methods=["PUT"])
def update_measurement(measurement_id):
    data = request.get_json(silent=True)
    if not data or not isinstance(data, dict):
        return jsonify({"error": "You must provide a JSON body with at least one field to update"}), 400

    updated, error = MeasurementDriver.update_measurement(measurement_id, data)
    if error:
        if "not found" in error.lower():
            return jsonify({"error": error}), 404
        return jsonify({"error": error}), 400
    return jsonify(updated), 200


@measurementRouteBlueprint.route("/delete/<measurement_id>", methods=["DELETE"])
def delete_measurement(measurement_id):
    response, error = MeasurementDriver.delete_measurement(measurement_id)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Measurement deleted", "measurement_id": response}), 200
