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

researcher_blueprint = Blueprint("researcher", __name__)

@researcher_blueprint.route("/<int:user_id>/projects", methods=["GET"])
@token_required
def get_projects(current_user, user_id):
    try:
        if request.method == 'GET':
            if current_user.type_user == UserType.EVALUATOR and current_user.id != user_id:
                raise CustomError("Only researcher  ", 401)
            projects = Project.query.filter_by(researcher_id=current_user.id).all()
            projects_list = [{"id": project.id, "name": project.name, "description": project.description } for project in projects]

            return Response(json.dumps(projects_list), status=201, mimetype="application/json") 
    except Exception as err:
         return jsonify({"error": str(err)}), 500

