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


# TODO tobe tested
@evaluators_blueprint.route("/projects", methods=["GET"])
@evaluator_required
@error_handler
def get_projects_to_value(current_user):
    evaluation_window = EvaluationWindow.get_first_window()
    print(type(evaluation_window))
    projects = Project.get_project_by_window_id(evaluation_window.id)
    project_data = [
        {"id": project.id, "name": project.name, "description": project.description, "status": str(project.status)}
        for project in projects]
    return Response(json.dumps(project_data), 200)