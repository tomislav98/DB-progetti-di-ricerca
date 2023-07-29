from flask import render_template, request, session, redirect, url_for, jsonify
from configuration import app, db, bcrypt
from model import Researcher


# @app.route('/', methods=['GET', 'POST'])
# def index():  # put application's code here
#     return render_template('index.html')


# this rout is needed for register the user(FORM)
@app.route('/register', methods=['GET', 'POST'])
def researcher_register():  # put application's code here

    if request.method == 'POST':
        data = request.get_json()
        # primary key is the mail of the user
        researcher = Researcher.query.filter_by(email=data['name']).first()
        if researcher is None:  # if user is NOT found then save user in dataBase and render them to login page
            Researcher.add_researcher(data['name'],
                                      data['surname'],
                                      data['email'],
                                      data['password'])
            return jsonify(data)

        else:  # id user IS found in dataBase then put the waring and redirect them another time to registration
            return jsonify({"error": 'errore'})
            # return redirect(url_for('researcher_register'))
    # the first time the client is sending the GET request


# TODO da finire
# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         email = request.form['email']
#         password = request.form['password']
#
#         # Effettua la verifica delle credenziali nel database
#         researcher = Researcher.query.filter_by(email_researcher=email).first()
#
#         if researcher and researcher.check_password(password):
#             # Credenziali valide, autenticazione riuscita
#             session['user_id'] = researcher.id
#             return redirect(url_for('project'))  # Reindirizza a una dashboard o area riservata
#         else:
#             # Credenziali non valide, mostra messaggio di errore
#             error_message = "Credenziali non valide. Riprova."
#             return render_template('researcher_login.html', error_message=error_message)
#
#     # Se la richiesta è di tipo GET, mostra il form di login
#     return render_template('researcher_login.html')

# @app.route('/projects', methods=['GET', 'POST'])
# def login():
#     if request.method == 'POST':
#         email = request.form['email']
#         password = request.form['password']
#
#         # Effettua la verifica delle credenziali nel database
#         researcher = Researcher.query.filter_by(email_researcher=email).first()
#
#         if researcher and researcher.check_password(password):
#             # Credenziali valide, autenticazione riuscita
#             session['user_id'] = researcher.id
#             return redirect(url_for('project'))  # Reindirizza a una dashboard o area riservata
#         else:
#             # Credenziali non valide, mostra messaggio di errore
#             error_message = "Credenziali non valide. Riprova."
#             return render_template('researcher_login.html', error_message=error_message)
#
#     # Se la richiesta è di tipo GET, mostra il form di login
#     return render_template('researcher_login.html')
