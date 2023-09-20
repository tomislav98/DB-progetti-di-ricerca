from flask import Blueprint
from config import bcrypt
from flask import request, jsonify, Response, json
from models.reports import AssessmentReport
from utils.exceptions import CustomError
from datetime import datetime, timedelta
import jwt
import os
from app import db
from utils.middleware import token_required
from models.project_versions import VersionProject

project_version_blueprint = Blueprint("project_version", __name__)


@project_version_blueprint.route("/<int:project_version_id>", methods=["GET"])
@token_required
def get_version_of_specific_project(project_version_id):
    """Get all info of version of specific project."""
    try:
        if request.method == "GET":
            project_version_id_json = []
            # Take all reports that have that project_id
            project_version_query = AssessmentReport.query.filter_by(id=project_version_id).first()

            if not project_version_query:
                raise ValueError("Unknown or invalid project_version_id.")
            else:
                version_data = {
                    "id": VersionProject.id,
                    "date_created": VersionProject.name,
                    "surname": VersionProject.description,
                    "status": str(VersionProject.status),
                    "project_id": VersionProject.project_id,
                }
                project_version_id_json.append(version_data)

                response_data = {
                    "message": "Got version of specific project successfully!",
                    "data": project_version_id_json,
                }
                return jsonify(response_data)
    except Exception as e:
        raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)


@project_version_blueprint.route("/<int:project_version_id>", methods=["PUT"])
@token_required
def update_version_of_specific_project(project_version_id):
    """Update info of version of specific project."""
    try:
        if request.method == "PUT":
            # Get data to be updated
            new_data = request.get_json()
            # Take all reports that have that report_id
            project_version_query = AssessmentReport.query.filter_by(id=project_version_id).first()

            if not project_version_query:
                raise ValueError("Unknown or invalid project_version_id")
            else:
                # Update data of reports
                for key, value in new_data.items():
                    setattr(project_version_query, key, value)
                # Need to do the commit before exit the function
                db.session.commit()
                return jsonify({"message": "Version of the specific project updated successfully"}), 200
    except Exception as e:
        raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)


@project_version_blueprint.route("/<int:project_version_id>", methods=["DELETE"])
@token_required
def delete_report(project_version_id):
    try:
        if request.method == "DELETE":
            project_version_query = AssessmentReport.query.filter_by(id=project_version_id).first()
            if not project_version_query:
                raise CustomError("Unknown or invalid project_version_id", 404)
            db.session.delete(project_version_query)
            db.session.commit()
            return jsonify({"message": "Version deleted successfully"}), 200

    except Exception:
        raise CustomError("bad request", 500)
