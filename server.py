from flask import Flask, jsonify, request
from model import User  # User.addUser(usr,email,pwd) ad esempio aggiunge un utente al DB
import json

app = Flask(__name__)


# Route that returns a list of every endpoint
@app.route('/', methods=['GET'])
def getAllEndpoints():
    return jsonify({'/': 'Route that returns a list of every endpoint ',
                    '/hello': 'Route that returns a JSON response'})


# Inserisce un utente nel DB
# type: POST
# body: {"username":"xxxxx", "email": "xxxxx", "password": "xxxxx"}
@app.route('/register', methods=['POST'])
def register():
    # procedure alla password qui
    try:
        User.add_user(request.json["username"], request.json["email"], request.json["password"])
        # response = json.loads(request.json)
        return jsonify(request.json)
    except Exception as e:
        return jsonify({"error": e.args})


if __name__ == '__main__':
    app.run(debug=True)
