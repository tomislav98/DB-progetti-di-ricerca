from flask import Blueprint
from config import bcrypt
from flask import request, jsonify, Response, json
from models.users import User, Evaluator, Researcher, UserType
from models.projects import Project, ProjectStatus
from utils.exceptions import CustomError, error_handler
from datetime import datetime, timedelta
import jwt
import os
from utils.middleware import token_required

proj_blueprint = Blueprint("proj", __name__)

# Se lo user è un ricercatore, restituisce, se il ricercatore e se stesso, tutte le versioni, 
# se uno é un valutatore restituisce le versioni se un progetto é SUBMITTED
# (quindi è nell ultima finestra di valutazione) (tranne quelle in cui è TO_BE_SUBMITTED)
# TODO: testare
@proj_blueprint.route("/<int:project_id>/versions", methods=["GET"])
@token_required
@error_handler
def get_project_versions_by_id(current_user, project_id):
    if request.method == 'GET':
        project_versions = Project.get_project_versions_list(project_id)
        if current_user == UserType.RESEARCHER or current_user == UserType.ADMIN:
            latest_version = project_versions[0].version
            for version in project_versions:
                if version.version > latest_version:
                    latest_version = version
                versions_data.append(version)
                response_data = {
                    "message": "Versions retrieved correctly!",
                    "project_versions": versions_data,
                    "latest_version": latest_version
                }
            return Response(json.dumps(response_data, 200))
        
        else:
            versions_data = []
            latest_version = project_versions[0].version
            for version in project_versions:
                if version.version > latest_version:
                    latest_version = version
                if version.status == ProjectStatus.SUBMITTED:
                    versions_data.append(version)
            response_data = {
                "message": "Versions retrieved correctly!",
                "project_versions": versions_data,
                "latest_version": latest_version
            }
            return Response(json.dumps(response_data), 200)
                
# @proj_blueprint.route("/<int:project_id>/latest")
# def get_latest_versions_by_id():
#     if request.method == "GET":
#         print(get_project_versions_by_id())