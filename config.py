from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_bcrypt import Bcrypt


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

        return cls._app

    @classmethod
    def get_db(cls):
        cls._app.config['SECRET_KEY'] = 'prova123chiavenonsegreta'
        cls._app.config['SQLALCHEMY_DATABASE_URI'] = \
            'postgresql://Aesee8oonaich7:oojaiqu8peuTae@157.230.29.227:7794/postgres'
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
from model import *
from views import *


if __name__ == "__main__":
    with app.app_context():
        # db.drop_all()
        db.create_all()
    app.run()
