from flask import Blueprint
from config import bcrypt
from flask import request, jsonify, Response, json
from models.users import User, Evaluator, Researcher, UserType
from models.projects import Project
from utils.exceptions import CustomError
from datetime import datetime, timedelta
import jwt
import os
from utils.middleware import token_required

proj_blueprint = Blueprint("proj", __name__)

@proj_blueprint.route("/", methods=["GET"])
@token_required
def get_projects(current_user):
    try:
        if request.method == 'GET':

            if current_user.type_user == UserType.RESEARCHER:
                raise CustomError("Only evalu ", 401)
            projects = Project.query.all()

            projects_list = [{"id": project.id, "name": project.name, "description": project.description } for project in projects]

            return Response(json.dumps(projects_list), status=201, mimetype="application/json") 
    except Exception as err:
        raise CustomError(err.message, err.status_code)

