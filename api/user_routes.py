from flask import Blueprint
from config import bcrypt
from flask import request, jsonify, Response, json
from models.users import User, Evaluator, Researcher, UserType
from utils.exceptions import CustomError
from datetime import datetime
import jwt
import os

user_blueprint = Blueprint("user", __name__)


# DONE
@user_blueprint.route("/", methods=["GET"])
def get_users():
    """Get all info of ALL users."""
    try:
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
            response_data = {
                "message": "Got Users successfully!",
                "data": users_json,
            }
            return jsonify(response_data)
    except Exception as e:
        raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)


# DONE
@user_blueprint.route("/register", methods=["POST"])
def register_user():  # put application's code here
    """Function is going to register researcher or evaluator."""
    try:
        if request.method == "POST":
            data = request.get_json()
            # primary key is the mail of the user
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
    except Exception as err:
        if err.status_code:
            raise CustomError(err.message, err.status_code)
        else:
            raise CustomError("Internal server error", 500)

    # the first time the client is sending the GET request


# TO DEBUG
@user_blueprint.route("/login", methods=["GET"])
def login():
    try:
        if request.method == "GET":
            data = request.get_json()
            isEvaluator = Evaluator.is_valid_evaluator(data)
            isResearcher = Researcher.is_valid_researcher(data)

            if isEvaluator or isResearcher:
                # Generate a JWT token
                payload = {
                    "sub": data[
                        "username"
                    ],  # Subject (usually the user's ID or username)
                    "exp": datetime.datetime.utcnow()
                           + datetime.timedelta(days=1),  # Token expiration
                    "isEvaluator": isEvaluator,
                    "isResearcher": isResearcher,
                }

                token = jwt.encode(
                    payload, os.environ.get("JWT_SECRET"), algorithm="HS256"
                )

                return jsonify({"token": token})
            else:
                raise CustomError("Credentials are not valid. Try again.", 401)

    except Exception as e:
        raise CustomError("An error occurred: " + str(e), 500)


# NOT DONE 
# Update a specific info of SPECIFIF user.
@user_blueprint.route("/<int:user_id>/<attribute_name>", methods=["PUT"])
def update_specific_user(user_id, attribute_name):
    try:
        if request.method == "PUT":
            user = User.query.get(user_id)
            if user:
                data = request.get_json()
                new_value = data.get(attribute_name)
                if new_value:
                    User.update_researcher(user, attribute_name, new_value)
                    return jsonify(
                        {"message": f"{attribute_name} updated successfully"}
                    )
    except Exception:
        raise CustomError("Can't UPDATE the data of researchers.", 500)


# NOT DONE

@user_blueprint.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            raise CustomError("User not found.", 404)

        if request.method == "DELETE":
            User.delete_user(user)
            return jsonify({"message": "User deleted successfully"})

    except Exception:
        raise CustomError("Can't delete the user.", 500)


# NOT DONE

# Get all info of SPECIFIC researcher.
@user_blueprint.route("/<int:user_id>", methods=["GET"])
def get_specific_user(user_id):
    try:
        if request.method == "GET":
            user = User.query.get(user_id)
            if user:
                researcher_data = {
                    "id": user.id,
                    "name": user.name,
                    "surname": user.surname,
                    "email": user.email,
                    "type_user": str(user.type_user),
                    # Aggiungi altri campi specifici del ricercatore se necessario
                }
                return jsonify(researcher_data)
    except Exception:
        raise CustomError("Can't got the data of user.", 500)
