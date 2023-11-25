from flask import Blueprint
from config import bcrypt
from flask import request, jsonify, Response, json
from models.reports import Report
from utils.db_utils import commit
from utils.exceptions import CustomError
from datetime import datetime, timedelta
import jwt
import os
from utils.middleware import token_required

report_blueprint = Blueprint("report", __name__)


@report_blueprint.route("/<int:project_id>", methods=["GET"])
@token_required
def get_reports_of_specific_project(project_id):
    """Get all info of ALL reports of specific projects."""
    try:
        if request.method == "GET":
            reports_json = []
            # Take all reports that have that project_id
            report_query = Report.query.filter_by(project_id=project_id)

            if report_query is None:
                raise ValueError("Unknown or invalid project_id(can not find reports of project)")
            else:
                for report in report_query:
                    report_data = {
                        "id": report.id,
                        "date_created": report.date_created,
                        "surname": report.content,
                        "evaluator_id": report.evaluator_id,
                        "project_id": report.project_id,
                    }
                    reports_json.append(report_data)

                response_data = {
                    "message": "Got reports of specific project successfully!",
                    "data": reports_json,
                }
                return jsonify(response_data)
    except Exception as e:
        raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)


@report_blueprint.route("/<int:report_id>", methods=["PUT"])
@token_required
def update_reports_of_specific_project(report_id):
    """Update all info of ALL reports of specific projects."""
    try:
        if request.method == "PUT":
            # Get data to be updated
            new_data = request.get_json()
            # Take all reports that have that report_id
            report_query = Report.query.filter_by(id=report_id)

            if report_query is None:
                raise ValueError("Unknown or invalid report_id")
            else:
                # Update data of reports
                for key, value in new_data.items():
                    setattr(report_query, key, value)
                # Need to do the commit before exit the function
                commit()

                return jsonify({"message": "Report updated successfully"}), 200
    except Exception as e:
        raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)


@report_blueprint.route("/<int:report_id>", methods=["DELETE"])
@token_required
def delete_report(report_id):
    try:
        if request.method == "DELETE":
            report = Report.query.get(report_id).first()
            if not report:
                raise CustomError("Unknown or invalid report_id", 404)
            db.session.delete(report)
            commit()
            return jsonify({"message": "Report deleted successfully"}), 200

    except Exception:
        raise CustomError("bad request", 500)
