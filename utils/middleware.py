from functools import wraps
import os
from flask import request
import jwt
from models.users import User, UserType


def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            if "Authorization" in request.headers:
                token = request.headers["Authorization"].split(" ")[1]
            if not token:
                return {
                    "message": "Authentication Token is missing!",
                    "data": None,
                    "error": "Unauthorized",
                }, 401
            try:
                data = jwt.decode(token, os.environ.get("JWT_SECRET"), algorithms=["HS256"])
                current_user = User.query.filter_by(id=data["user_id"]).first()

                if current_user is None:
                    return {
                        "message": f"Invalid Authentication token!",
                        "data": None,
                        "error": "Unauthorized",
                    }, 401

                if current_user.type_user != UserType.ADMIN:
                    if current_user.type_user != role and role is not None:
                        return {
                            "message": f"Invalid Authentication token! Only {role}s are allowed",
                            "data": None,
                            "error": "Unauthorized",
                        }, 401
            except Exception as e:
                return {
                    "message": "Something went wrong",
                    "data": None,
                    "error": str(e),
                }, 401

            return f(current_user, *args, **kwargs)

        return decorated

    return decorator


admin_required = role_required(UserType.ADMIN)
researcher_required = role_required(UserType.RESEARCHER)
evaluator_required = role_required(UserType.EVALUATOR)
token_required = role_required(None)  # Token required for all roles
