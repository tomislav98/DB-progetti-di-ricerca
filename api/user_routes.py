from flask import Blueprint
from config import bcrypt
from flask import request, jsonify, Response, json
from models.users import User, Evaluator, Researcher, UserType
from utils.exceptions import CustomError, error_handler
from datetime import datetime, timedelta
import jwt
import os
from utils.middleware import token_required

user_blueprint = Blueprint("user", __name__)

# Example of a route using token_required middleware, notice that the get_users function now need an additional argument - current_user -
@user_blueprint.route("/", methods=["GET"])
@token_required
@error_handler
def get_users(current_user):
    """Get all info of ALL users."""
    if request.method == "GET":
        users_json = []
        users_query = User.query  # Take all the user researchers and evaluators
        # codice added now
        query_parameters = request.args

        if "user_type" in query_parameters:
            user_type = UserType.get_enum_by_int(int(query_parameters.get("user_type")))

            if user_type is not None and User.check_user_role(user_type.value):
                users_query = users_query.filter_by(type_user=user_type)
            else:
                raise ValueError("Unknown or invalid user type")

        users = users_query.all()
        
        for user in users:
            if user.id != current_user.id:
                user_data = {
                    "id": user.id,
                    "name": user.name,
                    "surname": user.surname,
                    "email": user.email,
                    "type_user": str(
                        user.type_user
                    ),  # Need to convert type_user in string because it's enum
                }
                users_json.append(user_data)
            else:
                me = {
                    "me": "That's me! \N{grinning face with smiling eyes}",
                    "id": user.id,
                    "name": user.name,
                    "surname": user.surname,
                    "email": user.email,
                    "type_user": str(
                        user.type_user
                    ),  # Need to convert type_user in string because it's enum
                }
                users_json.insert(0,me)
        response_data = {
            "message": "Got Users successfully!",
            "data": users_json,
        }
        return jsonify(response_data)


# DONE
@user_blueprint.route("/register", methods=["POST"])
@error_handler
def register_user():  # put application's code here
    if request.method == "POST":
        data = request.get_json()

        if data["type_user"] < 0 or data["type_user"] >= 2:
            raise CustomError("Invalid user type", 400)

        user = User.query.filter_by(email=data["email"]).first()

        if (
                user is None  
        ):  # if user is NOT found then save user in dataBase and render them to login page
            User.add_user(
                data["name"],
                data["surname"],
                data["email"],
                data["password"],
                data["type_user"],
            )
            response_data = {
                "message": "User registered successfully",
                "data": data,
            }

            return Response(json.dumps(response_data), status=201, mimetype="application/json")
        else:
            raise CustomError("Email already in use", 409)

    # the first time the client is sending the GET request

# DONE
# Authenticates a user and returns a JWT in response
@user_blueprint.route("/login", methods=["POST"])
@error_handler
def login():
    if request.method == "POST":
        data = request.get_json()

        if "email" not in data or "password" not in data:
            raise CustomError("Email and password are required fields.", 400)

        valid_user = User.is_valid_user(data)
        if valid_user:
            payload = {
                "sub": valid_user.name,
                "exp": datetime.utcnow() + timedelta(days=1),
                "role": valid_user.type_user.__str__(),
                "user_id": valid_user.id
            }
            print(payload)
            token = jwt.encode(
                payload, os.environ.get("JWT_SECRET"), algorithm="HS256"
            )
            
            return jsonify({"token": token})
        else:
            raise CustomError("Credentials are not valid. Try again.", 401)

# TODO: Error handling and status codes
# Retrieves data of a specific user.
@user_blueprint.route("/<int:user_id>", methods=["GET"])
@token_required
@error_handler
def get_specific_user(current_user,user_id):
    if request.method == "GET":
        user = User.query.get(user_id)
        if user:
            researcher_data = {
                "id": user.id,
                "name": user.name,
                "surname": user.surname,
                "email": user.email,
                "type_user": str(user.type_user),
            }
            return jsonify(researcher_data)


# Update the specified field of the selected user.
@user_blueprint.route("/<int:user_id>/<attribute_name>", methods=["PUT"])
@token_required
@error_handler
def update_specific_user(current_user,user_id, attribute_name):
        if request.method == "PUT":
            user = User.query.get(user_id)
            if user:
                data = request.get_json()
                new_value = data.get(attribute_name)
                if new_value:
                    user.update_user(user, attribute_name, new_value)
                    return jsonify(
                        {"message": f"{attribute_name} updated successfully"}
                    )

# DONE 
@user_blueprint.route("/<int:user_id>", methods=["DELETE"])
@token_required
@error_handler
def delete_user(current_user,user_id):
    if current_user.id != user_id: # and current_user.role != "Admin"
        raise CustomError("Unauthorized to delete other users", 401)
    user = User.query.get(user_id)
    if not user:
        raise CustomError("User not found.", 404)

    if request.method == "DELETE":
        User.delete_user(user)
        return jsonify({"message": "User deleted successfully"})
