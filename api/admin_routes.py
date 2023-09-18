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
from utils.middleware import admin_required

admin_blueprint = Blueprint("admin", __name__)

# @admin_blueprint.route("/evaluation-window", methods=["POST"])
# @admin_required
# def add_window(current_user):
#     try:
#         if request.method == 'POST':
#             body = request.get_json()
#             d_start = body.get("date_start")
#             d_end = body.get("date_end")

#             EvaluationWindow.add_window(d_start, d_end)

#             return jsonify({"message":"Evaluation window created"}), 201 
#     except Exception as err:
#         if err:
#             raise CustomError(err.message, err.status_code)
#         raise CustomError("Internal server error", 500)

