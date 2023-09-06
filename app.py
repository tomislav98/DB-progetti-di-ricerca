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

if __name__ == '__main__':
    app.run(debug=True)
