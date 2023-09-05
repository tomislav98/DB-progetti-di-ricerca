from config import app, db
from api.user_routes import user_blueprint
from api.project_routes import proj_blueprint
from api.researchers_routes import researcher_blueprint
from api.admin_routes import admin_blueprint
from utils.exceptions import CustomError
from flask import request, jsonify
from models.users import User, Researcher, Evaluator
import jwt

# Metodo	Endpoint	Descrizione

# --------- USERS ---------------
# GET	/user	Ottenere la lista degli user --> FATTO
# POST	/user/register	Creare un nuovo utente (ricercatore o valutatore o blank) --> FATTO
# GET   /user/login Ottenere l'autorizzazione --> FATTO 
# GET	/user/{id}	Ottenere i dettagli di un utente --> FATTO
# PUT	/user/{id}	Aggiornare i dettagli di un utente --> FATTO
# DELETE	/user/{id}	Eliminare un utente  --> FATTO

# --------- RESEARCHERS ---------------
# GET   /ricercatori/{id}/progetti  Ottenere la lista dei progetti di un ricercatore (solo i suoi?)   OK
# POST  /ricercatori/{id}/progetti  Creare un nuovo progetto a nome del ricercatore {id}    OK
# GET   /ricercatori/{id}/progetti/{projectId}/messaggi Ottenere la lista dei messaggi del progetto {projectId} di uno specifico ricercatore {id}
# POST  /ricercatori/{id}/progetti/{projectId}/valutatori/{valutatoreId}/messaggi Inviare un messaggio nella chat del progetto {projectId} di uno specifico ricercatore {id}
# GET   /ricercatori/{id}/progetti/{projectId}/versioni     Ottenere tutte le versioni di un progetto OK
# GET   /ricercatori/{id}/progetti/{projectId}/versione/{versionId}/report Ottenere tutti i report di uno specifico progetto    OK
# GET   /ricercatori/{id}/progetti/{projectId}/valutatori Ottiene tutti i valutatori di uno specifico progetto  

# --------- EVALUATORS ---------------
# GET	/valutatori	Ottenere la lista dei valutatori
# GET	/valutatori/{id}	Ottenere i dettagli di un valutatore
# GET   /valutatori/{id}/report Ottenere la lista di report di un valutatore
# POST  /valutatori/{id}/progetti/{projectId}/report Creare un nuovo report di un progetto {projectId} a nome del valutatore {id}
# GET   /valutatori/{id}/progetti/{projectId}/report Ottenere tutti i report di uno specifico progetto {projectId} a nome del valutatore {id}
# GET   /valutatori/{id}/report     Ottenere tutti i report del valutatore {id}

# --------- MESSAGES ---------------
# POST	/messaggi	Creare un nuovo messaggio
# GET	/messaggi/{id}	Ottenere i dettagli di un messaggio
# PUT	/messaggi/{id}	Aggiornare i dettagli di un messaggio
# DELETE	/messaggi/{id}	Eliminare un messaggio

# --------- PROJECTS ---------------
# GET	/progetti	Ottenere la lista dei progetti
# POST	/progetti	Creare un nuovo progetto
# GET	/progetti/{id}	Ottenere i dettagli di un progetto
# PUT	/progetti/{id}	Aggiornare i dettagli di un progetto
# DELETE	/progetti/{id}	Eliminare un progetto

# --------- TODO: planning ---------------
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

app.register_blueprint(user_blueprint, url_prefix='/user')
app.register_blueprint(proj_blueprint, url_prefix='/projects')
app.register_blueprint(researcher_blueprint, url_prefix='/researchers')
app.register_blueprint(admin_blueprint, url_prefix='/admin')

# Definizione della funzione di gestione degli errori
@app.errorhandler(CustomError)
def handle_custom_error(error):
    response = jsonify({"error": error.message})
    response.status_code = error.status_code
    return response


# Route that returns a list of every endpoint
@app.route('/', methods=['GET'])
def getAllEndpoints():
    return jsonify({'/': 'Route that returns a list of every endpoint ',
                    '/register': 'Route that registers a user'})


@app.route('/projects', methods=['GET'])
def get_projects():
    try:
        if request.method == 'GET':
            data = request.get_json()
            return jsonify(data)
    except Exception:
        raise CustomError("Can't got the data of projects.", 500)


# @app.route('/researchers', methods=['GET'])
# def get_researchers():
#     """ Get all info of researchers."""
#     try:
#         if request.method == 'GET':
#             researchers_json = []
#             researchers = Researcher.query.all()
#             for researcher in researchers:
#                 researcher_data = {
#                     'id': researcher.id,
#                     'user_id': researcher.user_id,
#                     # Aggiungi altri campi specifici del ricercatore se necessario
#                 }
#                 researchers_json.append(researcher_data)
#             response_data = {
#                 'message': 'Researchers GET successfully',
#                 'data': researchers_json,
#             }
#             return jsonify(response_data)
#     except Exception:
#         raise CustomError("Can't got the data of researchers.", 500)


# @app.route('/researcher/<int:researcher_id>', methods=['GET'])
# def get_specific_researcher(researcher_id):
#     """ Get all info of SPECIFIC researcher."""
#     try:
#         if request.method == 'GET':
#             researcher = User.query.get(researcher_id)
#             if researcher and researcher.type_user == UserType.RESEARCHER:
#                 researcher_data = {
#                     'id': researcher.id,
#                     'name': researcher.name,
#                     'surname': researcher.surname,
#                     'email': researcher.email,
#                     # Aggiungi altri campi specifici del ricercatore se necessario
#                 }
#                 return jsonify(researcher_data)
#     except Exception:
#         raise CustomError("Can't got the data of researchers.", 500)


# @app.route('/researcher/<int:researcher_id>/<attribute_name>', methods=['PUT'])
# def update_specific_researcher(researcher_id, attribute_name):
#     """ Update a specific info of SPECIFIC researcher."""
#     try:
#         if request.method == 'PUT':
#             researcher = User.query.get(researcher_id)
#             if researcher:
#                 data = request.get_json()
#                 new_value = data.get(attribute_name)
#                 if new_value:
#                     User.update_researcher(researcher, attribute_name, new_value)
#                     return jsonify({'message': f'{attribute_name} updated successfully'})
#     except Exception:
#         raise CustomError("Can't UPDATE the data of researchers.", 500)


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


# # TODO need to verify
# @app.route('/researchers/<int:researcher_id>/projects', methods=['GET'])
# def get_projects_researchers(researcher_id):
#     """Function that search for all projects of specific researcher."""
#     try:
#         if request.method == 'GET':
#             researcher = Researcher.query.get(researcher_id)  # take researcher with that id
#             projects_researchers_dict = []
#             if researcher:
#                 projects_researchers = researcher.projects
#                 for project in projects_researchers:
#                     researcher_data = {
#                         "id": project.id,
#                         "name": project.name,
#                         "description": project.description,  # need to make status also(enum)
#                         "Data_creation": project.data_creation,
#                         "name_researcher": project.researcher.name  # I can do that because I have defined in models
#                         # projects = db.relationship('Project', backref='researcher')
#                     }
#                     projects_researchers_dict.append(researcher_data)
#                 return jsonify(projects_researchers_dict)
#     except Exception:
#         raise CustomError("Can't GET the data of projects.", 500)


if __name__ == '__main__':
    app.run(debug=True)
