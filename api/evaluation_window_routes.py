from flask import Blueprint
from config import bcrypt
from flask import request, jsonify, Response, json
from models.users import User, Evaluator, Researcher, UserType
from models.projects import Project
from models.evaluation_windows import EvaluationWindow
from utils.exceptions import CustomError
from datetime import datetime, timedelta
import jwt
import os
from utils.middleware import admin_required, token_required

window_blueprint = Blueprint("evaluation-window", __name__)


#La prima finestra che creiamo non è vincolata dalle altre, in caso vuoi testarne di più creane una con una data scaduta e poi altre con date maggiori
@window_blueprint.route("/", methods=["POST"])
@admin_required
def add_window(current_user):
    try:
        if request.method == 'POST':
            body = request.get_json()
            d_start = body.get("date_start")
            d_end = body.get("date_end")
            EvaluationWindow.add_window(d_start, d_end)
            return jsonify({"message":"Evaluation window created"}), 201 
    except CustomError as err:
        raise CustomError(err.message, err.status_code)
    except Exception as err:
        print(err)
        raise CustomError("Internal server error", 500)

@window_blueprint.route("/", methods=["GET"])
@token_required
def get_windows(current_user):
    try:
        if request.method == 'GET':
            windows = EvaluationWindow.query.all()
            windows_list = [{"id": win.id, "data_start": win.data_start, "data_end": win.data_end } for win in windows]

            return Response(json.dumps(windows_list),200)
        
    except Exception as err:
        if err:
            raise CustomError(err.message, err.status_code)
        raise CustomError("Internal server error", 500)
