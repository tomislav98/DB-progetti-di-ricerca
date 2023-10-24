from flask import Blueprint
from config import bcrypt
from flask import request, jsonify, Response, json
from models.users import User, Evaluator, Researcher, UserType
from models.projects import Project
from models.evaluation_windows import EvaluationWindow
from utils.exceptions import CustomError, error_handler
from datetime import datetime, timedelta
import jwt
import os
from utils.middleware import evaluator_required

evaluators_blueprint = Blueprint("evaluators", __name__)

# retrieves project to value, the only accessible by evaluators
@evaluators_blueprint.route("/projects", methods=["GET"])
@evaluator_required
@error_handler
def get_projects_to_value(current_user):
    evaluation_window =  EvaluationWindow.get_current_window()
    if not evaluation_window or evaluation_window.project:
        raise CustomError("There are no projects submitted yet", 404)

    project_data = [
        {"id": project.id, "name": project.name, "description": project.description, "status": str(project.status)}
        for project in evaluation_window.projects]
    return Response(json.dumps(project_data), 200)