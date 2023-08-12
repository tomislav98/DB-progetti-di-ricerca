from config import AppFactory
from flask import request, jsonify
from models import Researcher, Evaluator, Project, User, UserType

app = AppFactory.get_app()

# Metodo	Endpoint	Descrizione

# GET	/utenti	Ottenere la lista degli utenti --> FATTO
# POST	/utenti	Creare un nuovo utente (ricercatore o valutatore o blank) --> FATTO
# GET	/utenti/{id}	Ottenere i dettagli di un utente --> FATTO
# PUT	/utenti/{id}	Aggiornare i dettagli di un utente --> FATTO
# DELETE	/utenti/{id}	Eliminare un utente  --> FATTO

# GET	/ricercatori	Ottenere la lista dei ricercatori  --> FATTO
# GET	/ricercatori/{id}	Ottenere i dettagli di un ricercatore  --> FATTO
# GET   /ricercatori/{id}/progetti  Ottenere la lista dei progetti di un ricercatore    OK
# POST  /ricercatori/{id}/progetti  Creare un nuovo progetto a nome del ricercatore {id}    OK
# GET   /ricercatori/{id}/progetti/{projectId}/messaggi Ottenere la lista dei messaggi del progetto {projectId} di uno specifico ricercatore {id}
# POST  /ricercatori/{id}/progetti/{projectId}/valutatori/{valutatoreId}/messaggi Inviare un messaggio nella chat del progetto {projectId} di uno specifico ricercatore {id}
# GET   /ricercatori/{id}/progetti/{projectId}/versioni     Ottenere tutte le versioni di un progetto OK
# GET   /ricercatori/{id}/progetti/{projectId}/versione/{versionId}/report Ottenere tutti i report di uno specifico progetto    OK
# GET   /ricercatori/{id}/progetti/{projectId}/valutatori Ottiene tutti i valutatori di uno specifico progetto  

# GET	/valutatori	Ottenere la lista dei valutatori
# GET	/valutatori/{id}	Ottenere i dettagli di un valutatore
# GET   /valutatori/{id}/report Ottenere la lista di report di un valutatore
# POST  /valutatori/{id}/progetti/{projectId}/report Creare un nuovo report di un progetto {projectId} a nome del valutatore {id}
# GET   /valutatori/{id}/progetti/{projectId}/report Ottenere tutti i report di uno specifico progetto {projectId} a nome del valutatore {id}
# GET   /valutatori/{id}/report     Ottenere tutti i report del valutatore {id}

#

# -----------------------------------------------------

# POST	/messaggi	Creare un nuovo messaggio
# GET	/messaggi/{id}	Ottenere i dettagli di un messaggio
# PUT	/messaggi/{id}	Aggiornare i dettagli di un messaggio
# DELETE	/messaggi/{id}	Eliminare un messaggio

# GET	/progetti	Ottenere la lista dei progetti
# POST	/progetti	Creare un nuovo progetto
# GET	/progetti/{id}	Ottenere i dettagli di un progetto
# PUT	/progetti/{id}	Aggiornare i dettagli di un progetto
# DELETE	/progetti/{id}	Eliminare un progetto

# GET	/report-valutazioni	Ottenere la lista dei report di valutazione
# POST	/report-valutazioni	Creare un nuovo report di valutazione
# GET	/report-valutazioni/{id}	Ottenere i dettagli di un report di valutazione
# PUT	/report-valutazioni/{id}	Aggiornare i dettagli di un report di valutazione
# DELETE	/report-valutazioni/{id}	Eliminare un report di valutazione
# GET	/versioni-progetto	Ottenere la lista delle versioni di un progetto
# POST	/versioni-progetto	Creare una nuova versione di un progetto
# GET	/versioni-progetto/{id}	Ottenere i dettagli di una versione di un progetto
# PUT	/versioni-progetto/{id}	Aggiornare i dettagli di una versione di un progetto
# DELETE	/versioni-progetto/{id}	Eliminare una versione di un progetto
# GET	/documenti-progetto	Ottenere la lista dei documenti di un progetto
# POST	/documenti-progetto	Caricare un nuovo documento per un progetto
# GET	/documenti-progetto/{id}	Ottenere i dettagli di un documento di un progetto
# DELETE	/documenti-progetto/{id}	Eliminare un documento di un progetto
# GET	/finestre-valutazione	Ottenere la lista delle finestre di valutazione
# POST	/finestre-valutazione	Creare una nuova finestra di valutazione
# GET	/finestre-valutazione/{id}	Ottenere i dettagli di una finestra di valutazione
# PUT	/finestre-valutazione/{id}	Aggiornare i dettagli di una finestra di valutazione
# DELETE	/finestre-valutazione/{id}	Eliminare una finestra di valutazione


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
    return app.bcrypt.check_password_hash(hashed_password, password)

# Route that returns a list of every endpoint
@app.route('/', methods=['GET'])
def getAllEndpoints():
    return jsonify({'/': 'Route that returns a list of every endpoint ',
                    '/register': 'Route that registers a user'})

@app.route('/users', methods=['GET'])
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
    except Exception:
        raise CustomError("Can't got the data of researchers.", 500)


# this rout is needed for register the user(FORM)
@app.route('/register/user', methods=['POST'])
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


@app.route('/user/<int:user_id>/<attribute_name>', methods=['PUT'])
def update_specific_user(user_id, attribute_name):
    """ Update a specific info of SPECIFIF user."""
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


@app.route('/user/<int:user_id>', methods=['DELETE'])
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


@app.route('/user/<int:user_id>', methods=['GET'])
def get_specific_user(user_id):
    """ Get all info of SPECIFIC researcher."""
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
    """ Get all info of researchers."""
    try:
        if request.method == 'GET':
            researchers_json = []
            researchers = Researcher.query.all()
            for researcher in researchers:
                researcher_data = {
                    'id': researcher.id,
                    'user_id': researcher.user_id,
                    # Aggiungi altri campi specifici del ricercatore se necessario
                }
                researchers_json.append(researcher_data)
            response_data = {
                'message': 'Researchers GET successfully',
                'data': researchers_json,
            }
            return jsonify(response_data)
    except Exception:
        raise CustomError("Can't got the data of researchers.", 500)


@app.route('/researcher/<int:researcher_id>', methods=['GET'])
def get_specific_researcher(researcher_id):
    """ Get all info of SPECIFIC researcher."""
    try:
        if request.method == 'GET':
            researcher = User.query.get(researcher_id)
            if researcher and researcher.type_user == UserType.RESEARCHER:
                researcher_data = {
                    'id': researcher.id,
                    'name': researcher.name,
                    'surname': researcher.surname,
                    'email': researcher.email,
                    # Aggiungi altri campi specifici del ricercatore se necessario
                }
                return jsonify(researcher_data)
    except Exception:
        raise CustomError("Can't got the data of researchers.", 500)


@app.route('/researcher/<int:researcher_id>/<attribute_name>', methods=['PUT'])
def update_specific_researcher(researcher_id, attribute_name):
    """ Update a specific info of SPECIFIC researcher."""
    try:
        if request.method == 'PUT':
            researcher = User.query.get(researcher_id)
            if researcher:
                data = request.get_json()
                new_value = data.get(attribute_name)
                if new_value:
                    User.update_researcher(researcher, attribute_name, new_value)
                    return jsonify({'message': f'{attribute_name} updated successfully'})
    except Exception:
        raise CustomError("Can't UPDATE the data of researchers.", 500)


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
    
if __name__ == "__main__":
    app.run()
