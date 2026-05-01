from flask import Blueprint, request, jsonify, g
from Services.PromoDriver import PromoDriver
from Auth.verification import login_required_user, login_required_dev, login_required_admin, login_required_gym_owner

# AHFUL promo Routes
promoBlueprint = Blueprint("promo", __name__, url_prefix="/AHFULpromos")

# ── GET all promo ─────────────────────────────────────────────
@promoBlueprint.route("/", methods=["GET"])
@login_required_user
def get_all_promos():
    promos, error = PromoDriver.get_all_promos()
    if error:
        return jsonify({"error": error}), 500
    return jsonify(promos), 200

# ── GET promo by ID ────────────────────────────────────────────
@promoBlueprint.route("/<promo_id>", methods=["GET"])
@login_required_user
def get_promo(promo_id):
    promo, error = PromoDriver.get_promo_by_id(promo_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(promo), 200

# ── GET promo by gym ID ───────────────────────────────────────
@promoBlueprint.route("/gym/<gym_id>", methods=["GET"])
@login_required_gym_owner
def get_promos_by_gym(gym_id):
    promos, error = PromoDriver.get_promos_by_gym(gym_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(promos), 200

# ── CREATE promos for a gym ─────────────────────────────────────
@promoBlueprint.route("/create/<gym_id>", methods=["POST"])
#@login_required_gym_owner
def create_promo(gym_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    promo, error = PromoDriver.create_promo(
        gym_id=gym_id,
        user_id=g.user_id,
        data=data
    )
    if error:
        return jsonify({"error": error}), 400

    return jsonify(promo), 201

# ── UPDATE promo ───────────────────────────────────────────────
@promoBlueprint.route("/update/<promo_id>", methods=["PUT"])
#@login_required_gym_owner
def update_promo(promo_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    promo, error = PromoDriver.update_promo(
        promo_id=promo_id,
        user_id=g.user_id,
        data=data
    )
    if error:
        return jsonify({"error": error}), 400

    return jsonify(promo), 200

# ── DELETE promo ───────────────────────────────────────────────
@promoBlueprint.route("/delete/<promo_id>", methods=["DELETE"])
#@login_required_dev
def delete_promos(promo_id):
    result, error = PromoDriver.delete_promo(promo_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify(result), 200