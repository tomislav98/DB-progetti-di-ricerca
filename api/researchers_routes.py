from flask import Blueprint
from config import bcrypt
from flask import request, jsonify, Response, json
from models.project_documents import DocumentProject
from models.users import User, Evaluator, Researcher, UserType
from models.projects import Project, ProjectStatus
from models.evaluation_windows import EvaluationWindow
from utils.exceptions import CustomError, error_handler
from utils.enums import DocumentType
from utils.json_find import find_json_by_value
from datetime import datetime, date, timedelta
import jwt
import os
from utils.middleware import token_required, researcher_required

researcher_blueprint = Blueprint("researcher", __name__)

@researcher_blueprint.route("/<int:user_id>/projects", methods=["GET"])
@researcher_required
@error_handler
def get_researcher_projects(current_user, user_id):
    if request.method == 'GET':
        researcher = Researcher.get_researcher_from_user_id(user_id)
        if current_user.id != user_id and current_user.type_user != UserType.ADMIN:
            raise CustomError("Unauthorized, you can't retrieve another researcher's projects", 401)
        projects = Project.query.filter_by(researcher_id=researcher.id).all()
        projects_list = [{"id": project.id, "name": project.name, "description": project.description, "status": str(project.status), "version": project.latest_version} for project in
                            projects]

        return Response(json.dumps(projects_list), status=201, mimetype="application/json")
    

@researcher_blueprint.route("/<int:user_id>/projects", methods=["POST"])
@researcher_required
@error_handler
def add_researcher_project(current_user, user_id):
    if request.method == 'POST':
        if current_user.id != user_id:
            raise CustomError("Unauthorized, you can't create a project for another researcher", 401)

        researcher = Researcher.get_researcher_from_user_id(current_user.id)
        body = request.form
        files = request.files.getlist('files')
        
        
        project = Project.add_project(body["name"], body["description"], datetime.now(), researcher.id, files)
        
        return Response(json.dumps({    
            "message": "Project created successfully",
            "project": {
                "id": project.id, 
                "status": str(project.status),
                "name": project.name,
                "description": project.description,
            } 
        }), 200)
    
@researcher_blueprint.route("<int:user_id>/projects/<int:project_id>/submit", methods=["PUT"])
@researcher_required
@error_handler
def submit_project(current_user,user_id,project_id):
    if request.method == 'PUT':
        proj = Project.get_project_by_id(project_id)
        researcher = Researcher.get_researcher_from_user_id(user_id)
        if current_user.id != researcher.user_id and proj.researcher_id != researcher.id and current_user.type_user != UserType.ADMIN:
            raise CustomError("Unauthorized, you can't submit another researcher's project", 401)

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
         

@researcher_blueprint.route("<int:user_id>/projects/<int:project_id>/withdraw", methods=["PUT"])
@researcher_required
@error_handler
def withdraw_project(current_user,user_id,project_id):
    if request.method == 'PUT':
        proj = Project.get_project_by_id(project_id)
        researcher = Researcher.get_researcher_from_user_id(user_id)


        if current_user.id != researcher.user_id and proj.researcher_id != researcher.id and current_user.type_user != UserType.ADMIN:
            raise CustomError("Unauthorized, you can't submit another researcher's project", 401)

        if proj.status != ProjectStatus.SUBMITTED:
            return Response(json.dumps({"message": "Project cannot be withdrawn"}),409)
        
        if proj:
            response = proj.withdraw()

        if response is None:
            return Response({"message":"Project succesfully withdrawn"}, 200)

        return Response(json.dumps({"message":"Error withdrawing the project"}), 200)
   
@researcher_blueprint.route("<int:user_id>/projects/<int:project_id>", methods=["DELETE"])
@researcher_required
@error_handler
def delete_project(current_user,user_id,project_id):
    if request.method == 'DELETE':
        if current_user.id != user_id:
            raise CustomError("Unauthorized, you can't delete another researcher's project", 401)
        proj = Project.get_project_by_id(project_id)

        if proj.status == ProjectStatus.TO_BE_SUBMITTED:
            proj.delete()
            return Response(json.dumps({"message":"Project deleted successfully"}), 200)
        
        if proj.status == ProjectStatus.SUBMITTED:
            window = EvaluationWindow.get_by_id(proj.evaluation_window_id)
            if datetime.combine(window.data_start, datetime.min.time()) < datetime.now() and datetime.combine(window.data_end, datetime.min.time()) > datetime.now():
                return Response(json.dumps({"message":"Sorry, the evaluation period has already started"}), 200)
            proj.delete()
            return Response(json.dumps({"message":"Project deleted successfully"}), 200)

# Per adesso, puo modificare la versione di un progetto, aggiungendo una nuova versione con vX.X.X maggiore di quella piu recente,
# TODO continuare a testare il file da mettere, da finire completamente
@researcher_blueprint.route("<int:user_id>/projects/<int:project_id>", methods=["PUT"])
@researcher_required
@error_handler
def update_project_version(current_user, user_id, project_id):
    doctype = request.form.get('type')

    if request.method == "PUT":
        if current_user.id == user_id:
            project = Project.get_user_projects(user_id,project_id)
            if project is None:
                raise CustomError("There are no projects with such parameters", 404)
            version = request.form.get('version')
            files = request.files.getlist('files')
            files_metadata = json.loads(request.form.get('files_metadata'))
            if len(files_metadata) != len(files): 
                raise CustomError("Invalid Boby",400)
            file_associated = []
            #Format check del body
            for file in files:
                file_metadata = find_json_by_value(files_metadata, 'filename' ,file.filename)
                if file_metadata is None:
                    raise CustomError("Invalid body", 400)
                file_title = file_metadata.get("title")
                file_type = file_metadata.get("type")
                
                print(file_metadata)
                if file_title is None or file_type is None:
                    raise CustomError("Invalid body", 400)
                file_metadata.append('pdf_data', file.read())
                file_associated.append(file_metadata)

            updated = project[0].update_project_version(version)
                
                
            response_json = {
                "message": "Project updated correctly to version "+ updated.version
            }
            return Response(json.dumps(response_json),200)
        raise CustomError("You cannot update somebody else's project",403)