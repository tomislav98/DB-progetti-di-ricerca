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

@admin_blueprint.route("/op/<int:user_id>", methods=["POST"])
@admin_required
@error_handler
def op_user(current_user, user_id):
    usr = User.query.filter_by(id=user_id).first()
    if usr is None:
        raise CustomError("User does not exist", 400)
    usr.op_user()

    usr_data = {"message": "Made user an operator","opped-user":{"name": usr.name, "id": usr.id,}}

    return Response(json.dumps(usr_data), 200)