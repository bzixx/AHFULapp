from flask import Blueprint, jsonify, request, current_app
from flaskr.API_routes.decorators.auth_decorator import auth_required
import flaskr.services.util.report as reportService
from flaskr.services.mongodb.report_DBsrv import ReportDBService

# Blueprint for report routes
reports_bp = Blueprint('reports', __name__, url_prefix='/reports')

# Get all reports or filter by query parameters
@reports_bp.route('/query', methods=['GET'])
@auth_required
def query_reports():
    """Query reports with optional filters"""
    try:
        filter_query = dict(request.args)
        service: ReportDBService = current_app.report_service
        docs = service.get_all_documents(filter_query)
        for doc in docs:
            if '_id' in doc:
                doc['_id'] = str(doc['_id'])
        return jsonify(docs), 200
    except Exception as e:
        current_app.logger.error(f"Error querying reports: {str(e)}")
        return jsonify({"error": "Failed to query reports"}), 500

# Add a new report
@reports_bp.route('/create', methods=['POST'])
@auth_required
def add_report():
    """Generate and save a new compliance report"""
    try:
        new_report = reportService.generate_cred_compliance_report()
        if not new_report:
            return jsonify({"error": "Report generation failed"}), 500
        service: ReportDBService = current_app.report_service
        result = service.create_document(new_report)
        return jsonify({"inserted_id": str(result)}), 201
    except Exception as e:
        current_app.logger.error(f"Error creating report: {str(e)}")
        return jsonify({"error": "Failed to create report"}), 500

# Delete a report by ID
@reports_bp.route('/delete/<document_id>', methods=['DELETE'])
@auth_required
def delete_report(document_id):
    """Delete a report by document ID"""
    try:
        if not document_id:
            return jsonify({"error": "No document ID provided"}), 400
        service: ReportDBService = current_app.report_service
        deleted_count = service.delete_document(document_id)
        if deleted_count == 0:
            return jsonify({"error": "Document not found"}), 404
        return jsonify({"deleted_count": deleted_count}), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting report {document_id}: {str(e)}")
        return jsonify({"error": "Failed to delete report"}), 500