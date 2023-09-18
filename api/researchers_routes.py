from flask import Blueprint
from config import bcrypt
from flask import request, jsonify, Response, json
from models.users import User, Evaluator, Researcher, UserType
from models.projects import Project, ProjectStatus
from models.evaluation_windows import EvaluationWindow
from utils.exceptions import CustomError
from datetime import datetime, date, timedelta
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
            projects = Project.query.filter_by(researcher_id=user_id).all()
            projects_list = [{"id": project.id, "name": project.name, "description": project.description, "status": str(project.status)} for project in
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
                raise CustomError("Unauthorized, you can't create a project for another researcher", 401)

            body = request.get_json()
            Project.add_project(body["name"], body["description"], datetime.now(), current_user.id)

            return Response(json.dumps({"message": "project created successfully"}), 200)
    except Exception as err:
        if err:
            raise CustomError(err.message, err.status_code)
        raise CustomError("Internal server error", 500)

@researcher_blueprint.route("<int:user_id>/projects/<int:project_id>/submit", methods=["PUT"])
@researcher_required
def submit_project(current_user,user_id,project_id):
    try:
        if request.method == 'PUT':
            if current_user.id != user_id:
                raise CustomError("Unauthorized, you can't submit another researcher's project", 401)
            proj = Project.get_project_by_id(project_id)

            print(proj.status)

            if proj.status != ProjectStatus.TO_BE_SUBMITTED:
                return Response(json.dumps({"message": "Project cannot be submitted"}),409)
            
            if proj:
                response = proj.submit()

                response_json = {
                    "id": project_id,  
                    "status": str(response.status), 
                    "evaluation_window": response.evaluation_window_id 
                }

            if response is not None:
                return Response(json.dumps(response_json), 200)

            return Response(json.dumps({"message":"Error submitting the project"}), 200)
    except Exception as err:
        raise CustomError("Internal server error", 500)        
    
@researcher_blueprint.route("<int:user_id>/projects/<int:project_id>", methods=["DELETE"])
@researcher_required
def delete_project(current_user,user_id,project_id):
    try:
        if request.method == 'DELETE':
            if current_user.id != user_id:
                raise CustomError("Unauthorized, you can't delete another researcher's project", 401)
            proj = Project.get_project_by_id(project_id)

            if proj.status == ProjectStatus.TO_BE_SUBMITTED:
                print(proj)
                proj.delete()
                print(proj)
                return Response(json.dumps({"message":"Project deleted successfully"}), 200)
            
            if proj.status == ProjectStatus.SUBMITTED:
                window = EvaluationWindow.get_by_id(proj.evaluation_window_id)
                if datetime.combine(window.data_start, datetime.min.time()) < datetime.now():
                    return Response(json.dumps({"message":"Sorry, the evaluation period has already started"}), 200)
                proj.delete()
                return Response(json.dumps({"message":"Project deleted successfully"}), 200)
 
    except Exception as err:
        print(err)
        raise CustomError("Internal server error", 500)