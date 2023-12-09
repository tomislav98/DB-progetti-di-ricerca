from config import app
from api.user_routes import user_blueprint
from api.project_routes import proj_blueprint
from api.researchers_routes import researcher_blueprint
from api.evaluation_window_routes import window_blueprint
from api.evaluators_routes import evaluators_blueprint
from api.project_version_routes import project_version_blueprint
from api.unauth_user_routes import unauth_user_blueprint
from api.documents_routes import documents_blueprint
from utils.exceptions import CustomError
from flask import  jsonify
from utils.scheduler import evaluate_current_window_projects
from apscheduler.schedulers.background import BackgroundScheduler





app.register_blueprint(user_blueprint, url_prefix='/user')
app.register_blueprint(proj_blueprint, url_prefix='/projects')
app.register_blueprint(researcher_blueprint, url_prefix='/researchers')
app.register_blueprint(evaluators_blueprint, url_prefix='/evaluators')
app.register_blueprint(window_blueprint, url_prefix='/evaluation-window')
app.register_blueprint(project_version_blueprint, url_prefix='/version_project')
app.register_blueprint(unauth_user_blueprint, url_prefix='/unauth-user' )
app.register_blueprint(documents_blueprint, url_prefix='/documents')
scheduler = BackgroundScheduler()

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

#scheduler.add_job(lambda : evaluate_current_window_projects(), 'interval', seconds = 10)

scheduler.add_job(lambda : evaluate_current_window_projects(), 'cron', hour = 0, minute = 0 )
scheduler.start() 

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
    
