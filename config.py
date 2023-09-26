from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(app)
load_dotenv()

app.config['SECRET_KEY'] = os.environ.get('DB_SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
