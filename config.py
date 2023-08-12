from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os

# # singleton
class AppFactory:
    _app = None
    _db = None
    _bcrypt = None

    @classmethod
    def get_app(cls):
        if cls._app is None:
            cls._app = Flask(__name__)
            # Configurazioni dell'applicazione
            # cls._app.register_blueprint(auth_blueprint, url_prefix='/auth')
            load_dotenv()

        return cls._app

    @classmethod
    def get_db(cls):
        cls._app.config['SECRET_KEY'] = os.environ.get('DB_SECRET_KEY')
        cls._app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URL')
        cls._app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # needed for performance
        if cls._db is None:
            cls._db = SQLAlchemy(cls._app)

        return cls._db

    @classmethod
    def get_bcrypt(cls):
        cls._bcrypt = Bcrypt(cls._app)
        return cls._bcrypt

app = AppFactory.get_app()
db = AppFactory.get_db()
bcrypt = AppFactory.get_bcrypt()