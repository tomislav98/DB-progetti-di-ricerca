from flask import Blueprint
from config import bcrypt
from flask import request, jsonify, Response, json
from models.users import User, Evaluator, Researcher, UserType
from models.projects import Project
from models.evaluation_windows import EvaluationWindow
from utils.exceptions import CustomError
from utils.dates import str2datetime
from datetime import datetime, timedelta
import jwt
import os
from utils.middleware import admin_required, token_required

window_blueprint = Blueprint("evaluation-window", __name__)


# TODO fare in modo che non si possa creare una finestra con data di fine precedente a quella odierna
@window_blueprint.route("/", methods=["POST"])
@admin_required
def add_window(current_user):
    try:
        if request.method == 'POST':
            body = request.get_json()
            d_start = body.get("date_start")
            d_end = body.get("date_end")

            if str2datetime(d_end) < datetime.now():
                raise CustomError("You cannot create an evaluation window that has already ended!", 400)
            
            EvaluationWindow.add_window(d_start, d_end)

            return jsonify({"message":"Evaluation window created"}), 201 
    except Exception as err:
        if err:
            raise CustomError(err.message, err.status_code)
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
