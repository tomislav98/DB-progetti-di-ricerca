from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
# Secret key is needed for CSRF protection when using WTForms
app.config['SECRET_KEY'] = 'prova123chiavenonsegreta'

"""Data base configurations"""

basedir = os.path.abspath(os.path.dirname(__file__))
# + os.path.join(basedir, 'data.pgdb')
app.config['SQLALCHEMY_DATABASE_URI'] = \
    'postgresql://Aesee8oonaich7:oojaiqu8peuTae@157.230.29.227:7794/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # needed for performance
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
from model import *

from view import *

app.run()
