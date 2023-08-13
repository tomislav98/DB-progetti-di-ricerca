from flask import Blueprint
from config import bcrypt
from flask import request, jsonify
from models.users import User
from utils.exceptions import CustomError

user_blueprint = Blueprint('user', __name__)

@user_blueprint.route('/', methods=['GET'])
def get_users():
    """ Get all info of ALL users."""
    try:
        if request.method == 'GET':
            users_json = []
            users = User.query.all()
            for user in users:
                user_data = {
                    'id': user.id,
                    'name': user.name,
                    'surname': user.surname,
                    'email': user.email,
                    'type_user': str(user.type_user),  # Need to convert type_user in string because it's enum
                }
                users_json.append(user_data)
            response_data = {
                'message': 'Got Users successfully!',
                'data': users_json,
            }
            return jsonify(response_data)
    except Exception as err:
        raise CustomError(err.args, 500)


@user_blueprint.route('/register', methods=['POST'])
def register_user():  # put application's code here
    """Function is going to register researcher or evaluator."""
    try:
        if request.method == 'POST':
            data = request.get_json()
            # primary key is the mail of the user
            user = User.query.filter_by(email=data['email']).first()
            if user is None:  # if user is NOT found then save user in dataBase and render them to login page
                User.add_user(data['name'],
                              data['surname'],
                              data['email'],
                              data['password'],
                              data['type_user'])
                response_data = {
                    'message': 'User registered successfully',
                    'data': data
                }
                return jsonify(response_data)
    except Exception:
        raise CustomError("Credential are not valid. try again.", 500)
    # the first time the client is sending the GET request

# Update a specific info of SPECIFIF user.
@user_blueprint.route('/<int:user_id>/<attribute_name>', methods=['PUT'])
def update_specific_user(user_id, attribute_name):
    try:
        if request.method == 'PUT':
            user = User.query.get(user_id)
            if user:
                data = request.get_json()
                new_value = data.get(attribute_name)
                if new_value:
                    User.update_researcher(user, attribute_name, new_value)
                    return jsonify({'message': f'{attribute_name} updated successfully'})
    except Exception:
        raise CustomError("Can't UPDATE the data of researchers.", 500)


@user_blueprint.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            raise CustomError("User not found.", 404)

        if request.method == 'DELETE':
            User.delete_user(user)
            return jsonify({'message': 'User deleted successfully'})

    except Exception:
        raise CustomError("Can't delete the user.", 500)

# Get all info of SPECIFIC researcher.
@user_blueprint.route('/<int:user_id>', methods=['GET'])
def get_specific_user(user_id):
    try:
        if request.method == 'GET':
            user = User.query.get(user_id)
            if user:
                researcher_data = {
                    'id': user.id,
                    'name': user.name,
                    'surname': user.surname,
                    'email': user.email,
                    'type_user': str(user.type_user),
                    # Aggiungi altri campi specifici del ricercatore se necessario
                }
                return jsonify(researcher_data)
    except Exception:
        raise CustomError("Can't got the data of user.", 500)
