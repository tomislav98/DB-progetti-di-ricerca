from flask import Blueprint
from config import bcrypt
from flask import request, jsonify, Response, json
from models.users import User, Evaluator, Researcher, UserType
from utils.exceptions import CustomError, error_handler
from datetime import datetime, timedelta
import jwt
import os
from utils.middleware import token_required

unauth_user_blueprint = Blueprint("unauth-user", __name__)

@unauth_user_blueprint.route("/", methods=["GET"])
@error_handler
def is_db_empty():
    if request.method == "GET":
        users = User.query.first()

        if users:
            response_data = {
                "message": "The db contains some users already",
                "response": False
            }
        else:
            response_data = {
                "message": "The db does not contain users already",
                "response": True
            }
        return Response(json.dumps(response_data), status=201, mimetype="application/json")
