from flask import Blueprint, request, jsonify
from Services.VerificationDriver import VerificationDriver

verificationRouteBlueprint = Blueprint("verification", __name__, url_prefix="/AHFULverify")

# ── VERIFY email by id ─────────────────────────────────────────────────────
@verificationRouteBlueprint.route("/verify/email/user_id/", methods=["POST"])
def verify_email_by_user_id():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    user_id = data.get("user_id")
    res, err = VerificationDriver.verify_user_email(user_id)

    if err:
        if "not found" in err.lower():
            return jsonify({"error": err}), 404
        return jsonify({"error": err}), 400

    return jsonify({"message": res}), 200

# ── VERIFY phone by id ─────────────────────────────────────────────────────
@verificationRouteBlueprint.route("/verify/phone/user_id/", methods=["POST"])
def verify_phone_by_user_id():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    user_id = data.get("user_id")
    res, err = VerificationDriver.verify_user_phone_number(user_id)

    if err:
        if "not found" in err.lower():
            return jsonify({"error": err}), 404
        return jsonify({"error": err}), 400

    return jsonify({"message": res}), 200

# ── VERIFY phone by id ─────────────────────────────────────────────────────
@verificationRouteBlueprint.route("/verify/email/<token_id>/<token>",methods=["GET"])
def verify_email_token(token_id, token):
    res, err = VerificationDriver.confirm_email_token(token_id, token)
    if err:
        return jsonify({"error": err}), 400
    return jsonify({"message": res}), 200
