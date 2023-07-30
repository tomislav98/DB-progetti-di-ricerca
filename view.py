from flask import request, jsonify
from configuration import app, bcrypt
from model import Researcher, Evaluator, Project


# Definizione della classe CustomError (se l'hai già definita altrove)
class CustomError(Exception):
    def __init__(self, message, status_code):
        super().__init__()
        self.message = message
        self.status_code = status_code


# Definizione della funzione di gestione degli errori
@app.errorhandler(CustomError)
def handle_custom_error(error):
    response = jsonify({"error": error.message})
    response.status_code = error.status_code
    return response


def get_all_password_hashes_from_db(type_user):
    """ its generic function that return all password of researcher or evaluator"""
    # Recupera tutte le password hash dalla tabella User
    if type_user == 'researcher':
        researchers = Researcher.query.all()
        return [researcher.password for researcher in researchers]
    elif type_user == 'evaluator':
        evaluators = Evaluator.query.all()
        return [evaluator.password for evaluator in evaluators]
    else:
        print('Something is wrong in function get_all_password_hashes_from_db()!')


def check_password(hashed_password, password):
    """ function that return True if password inserted by user is matching the hashcode."""
    return bcrypt.check_password_hash(hashed_password, password)


# @app.route('/', methods=['GET', 'POST'])
# def index():  # put application's code here
#     return render_template('index.html')


# this rout is needed for register the user(FORM)
# TODO we need to understand in which way we are going to distinguish register from evaluator.
@app.route('/register', methods=['POST'])
def researcher_register():  # put application's code here
    """Function is going to register researcher or evaluator."""
    try:
        if request.method == 'POST':
            data = request.get_json()
            # primary key is the mail of the user
            researcher = Researcher.query.filter_by(email=data['email']).first()
            if researcher is None:  # if user is NOT found then save user in dataBase and render them to login page
                Researcher.add_researcher(data['name'],
                                          data['surname'],
                                          data['email'],
                                          data['password'])
                return jsonify(data)
    except Exception:
        raise CustomError("Credential are not valid. try again.", 500)
    # the first time the client is sending the GET request


def is_valid_researcher(data):
    """Function that verify if researcher that is loging is valid."""
    # Need to verify that email could exist, and if mail NOT exist then rise an error
    is_email_found = Researcher.query.filter_by(email=data['email']).first()
    # Need to verify that hash password could exist, and if hash password NOT exist then rise an error
    hash_list = get_all_password_hashes_from_db('researcher')
    is_password_found = False
    for password_hash in hash_list:
        if check_password(password_hash, data['password']):
            is_password_found = True
            break

    if is_email_found and is_password_found:
        return True
    return False


def is_valid_evaluator(data):
    """Function that verify if evaluator that is loging is valid."""
    # Need to verify that email could exist, and if mail NOT exist then rise an error
    is_email_found = Evaluator.query.filter_by(email=data['email']).first()
    # Need to verify that hash password could exist, and if hash password NOT exist then rise an error
    hash_list = get_all_password_hashes_from_db('evaluator')
    is_password_found = False
    for password_hash in hash_list:
        if check_password(password_hash, data['password']):
            is_password_found = True
            break

    if is_email_found and is_password_found:
        return True
    return False


@app.route('/login', methods=['POST'])
def login():
    """Function that log user.
    I separated the validation into
    two function so in that way in the
     future I can change just that part of code."""
    try:
        if request.method == 'POST':
            data = request.get_json()
            if is_valid_evaluator(data) or is_valid_researcher(data):
                return jsonify(data)
    except Exception:
        raise CustomError("Credential are not valid. try again.", 401)


@app.route('/projects', methods=['GET'])
def get_projects():
    try:
        if request.method == 'GET':
            data = request.get_json()
            return jsonify(data)
    except Exception:
        raise CustomError("Can't got the data of projects.", 500)


@app.route('/researchers', methods=['GET'])
def get_researchers():
    try:
        if request.method == 'GET':
            data = request.get_json()
            return jsonify(data)
    except Exception:
        raise CustomError("Can't got the data of researchers.", 500)


# TODO need to verify
@app.route('/create_project/<int:ricercatore_id>', methods=['GET', 'POST'])
def create_project(ricercatore_id):
    """Function that create a project which is associated with a researcher"""
    try:
        if request.method == 'POST':
            data = request.get_json()
            # Ottieni i dati inseriti dal ricercatore nel form
            title = request.form['title']
            description = request.form['description']

            Project.add_project(data['name'],
                                data['description'],
                                data['data_creation'],
                                )
            return jsonify(data)
    except Exception:
        raise CustomError("Can't POST the data of projects.", 500)


# TODO need to verify
@app.route('/researchers/<int:researcher_id>/projects', methods=['GET'])
def get_projects_researchers(researcher_id):
    """Function that search for all projects of specific researcher."""
    try:
        if request.method == 'GET':
            researcher = Researcher.query.get(researcher_id)  # take researcher with that id
            projects_researchers_dict = []
            if researcher:
                projects_researchers = researcher.projects
                for project in projects_researchers:
                    researcher_data = {
                        "id": project.id,
                        "name": project.name,
                        "description": project.description,  # need to make status also(enum)
                        "Data_creation": project.data_creation,
                        "name_researcher": project.researcher.name  # I can do that because I have defined in models
                        # projects = db.relationship('Project', backref='researcher')
                    }
                    projects_researchers_dict.append(researcher_data)
                return jsonify(projects_researchers_dict)
    except Exception:
        raise CustomError("Can't GET the data of projects.", 500)
