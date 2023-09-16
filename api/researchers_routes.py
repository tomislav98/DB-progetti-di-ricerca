from flask import Blueprint
from config import bcrypt
from flask import request, jsonify, Response, json
from models.users import User, Evaluator, Researcher, UserType
from models.projects import Project
from utils.exceptions import CustomError
from datetime import datetime, timedelta
import jwt
import os
from utils.middleware import token_required, researcher_required

researcher_blueprint = Blueprint("researcher", __name__)


@researcher_blueprint.route("/<int:user_id>/projects", methods=["GET"])
@researcher_required
def get_researcher_projects(current_user, user_id):
    try:
        if request.method == 'GET':
            if current_user.id != user_id and current_user.type_user != UserType.ADMIN:
                raise CustomError("Unauthorized, you can't retrieve another researcher's projects", 401)
            projects = Project.query.filter_by(researcher_id=current_user.id).all()
            projects_list = [{"id": project.id, "name": project.name, "description": project.description} for project in
                             projects]

            return Response(json.dumps(projects_list), status=201, mimetype="application/json")
    except Exception as err:
        if err:
            raise CustomError(err.message, err.status_code)
        raise CustomError("Internal server error", 500)


@researcher_blueprint.route("/<int:user_id>/projects", methods=["POST"])
@researcher_required
def add_researcher_project(current_user, user_id):
    try:
        if request.method == 'POST':
            if current_user.id != user_id:
                raise CustomError("Unauthorized, you can't retrieve another researcher's projects", 401)

            body = request.get_json()
            Project.add_project(body["name"], body["description"], datetime.now(), current_user.id)

            return Response(json.dumps({"message": "project created successfully"}), 200)
    except Exception as err:
        if err:
            raise CustomError(err.message, err.status_code)
        raise CustomError("Internal server error", 500)
