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
from utils.middleware import admin_required, token_required

window_blueprint = Blueprint("evaluation-window", __name__)


# La prima finestra che creiamo non è vincolata dalle altre, in caso vuoi testarne di più creane una con una data
# scaduta e poi altre con date maggiori
@window_blueprint.route("/", methods=["POST"])
@admin_required
@error_handler
def add_window(current_user):
        if request.method == 'POST':
            body = request.get_json()
            d_start = body.get("date_start")
            d_end = body.get("date_end")
            EvaluationWindow.add_window(d_start, d_end)
            return jsonify({"message":"Evaluation window created"}), 201 


@window_blueprint.route("/", methods=["GET"])
@admin_required
@error_handler
def get_windows(current_user):
    if request.method == 'GET':
        windows = EvaluationWindow.get_all_windows()
        windows_list = [{"id": win.id, "data_start": win.data_start, "data_end": win.data_end } for win in windows]

        return Response(json.dumps(windows_list),200)

@window_blueprint.route("/", methods = ["DELETE"])
@admin_required
@error_handler
def delete_window(current_user):
    if request.method == "DELETE":
        EvaluationWindow.delete_first_window()
        return jsonify({"message": "Evaluation Window deleted"}),200
    

@window_blueprint.route("/<int:evaluation_window_id>/projects", methods=["GET"])
@admin_required
@error_handler
def get_window_projects(current_user, evaluation_window_id):
    if request.method == 'GET':
        window = EvaluationWindow.get_by_id(evaluation_window_id)
        if window is None: 
             raise CustomError("Invalid Id", 400)
        projects = window.project
        projects_list = [{"id": proj.id, "name": proj.name, "description": proj.description, "version": proj.latest_version, "status": str(proj.status) } for proj in projects]
        return Response(json.dumps(projects_list),200)


