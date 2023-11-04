from flask import Blueprint
from config import bcrypt
from flask import request, jsonify, Response, json
from models.project_documents import DocumentProject
from models.users import User, Evaluator, Researcher, UserType
from models.projects import Project, ProjectStatus
from models.evaluation_windows import EvaluationWindow
from utils.exceptions import CustomError, error_handler
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
        files = request.files # in caso non venga fornito un file np viene handlato dentro l'addproject
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
    
# TODO: usare le join per unire Users, Researchers, Projects 
# anche per vedere se ce un user associato a quel progetto, senno uno puo cheattare e 
# submittare qualsiasi progetto 
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
   

@researcher_blueprint.route("<int:user_id>/projects/<int:project_id>/file", methods=["POST"])
@researcher_required
@error_handler
def save_file(current_user, user_id, project_id):
    if request.method == 'POST':
        if 'file' not in request.files:
            return CustomError("No file apart",400)
        file = request.files['file']

        if file.filename == '':
            return CustomError("No selected file",400)
        

        file_data = file.read()
        document = DocumentProject.create_document(name=file.filename, type_document="Deliverables", project_id=project_id, pdf_data=file_data)
        return document,200


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

# Per adesso, puo modificare la versione di un progetto, aggiungendo una nuova versione con vX.X.X maggiore di quella piu recente
# TODO continuare a testare il file da mettere, da finire completamente
@researcher_blueprint.route("<int:user_id>/projects/<int:project_id>", methods=["PUT"])
@researcher_required
@error_handler
def update_project_version(current_user, user_id, project_id):
    if request.method == "PUT":
        if current_user.id == user_id:
            #body = request.get_json()
            project = Project.get_user_projects(user_id,project_id)
            if project is None:
                raise CustomError("There are no projects with such parameters", 404)
            version = request.form.get('version')
            file = request.files.get('file')

            updated = project[0].update_project_version(version)
            #if there's a file then it create and associate it
            if file:
                DocumentProject.create_document(name=file.filename,type_document="Mimmo", version_project_id= updated.id, pdf_data=file.read())
            

            response_json = {
                "message": "Project updated correctly to version "+ updated.version
            }
            return Response(json.dumps(response_json),200)
        raise CustomError("You cannot update somebody else's project",403)