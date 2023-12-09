from enum import Enum
from config import db, bcrypt
from utils.db_utils import add_instance, commit

class UserType(Enum):
    RESEARCHER = 0
    EVALUATOR = 1
    ADMIN = 2

    @staticmethod
    def get_enum_by_int(type_user):
        match type_user:
            case 0:
                return UserType.RESEARCHER
            case 1:
                return UserType.EVALUATOR
            case _:
                print("Errore")

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    type_user = db.Column(db.Enum(UserType))  # discriminator attribute

    @classmethod
    def check_user_role(cls, type_user):
        for user in UserType:
            if user.value == type_user:
                return True
        return False

    # Crea un utente, se è il primo utente del DB viene settato ad admin,
    # indipendentemente dai parametri scelti 
    @classmethod
    def add_user(cls, name, surname, email, password, type_user):
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        type_user_enum = None

        if cls.check_user_role(type_user):
            type_user_enum = UserType.RESEARCHER
            users = User.query.first()

            if users is None:
                type_user_enum = UserType.ADMIN 
            if type_user == UserType.EVALUATOR.value:
                type_user_enum = UserType.EVALUATOR
            user = cls(name=name, surname=surname, email=email, password=hashed_password, type_user=type_user_enum)
            add_instance(user)
        else:
            raise ValueError("Unknown or invalid user type")


    @staticmethod
    def get_user_by_id(user_id):
        user = User.query.filter_by(id=user_id).first()
        
        if user :
            return user
        else:
            return None



       

    # If credentials are valid, this returns a User instance, None otherwise
    @staticmethod
    def is_valid_user(data):
        user = User.query.filter_by(email=data['email']).first()
        if user:
            is_password_valid = bcrypt.check_password_hash(user.password, data["password"])

            if is_password_valid:
                return user
        return None

    @classmethod
    def update_user(cls, user_object, attribute_name, new_value):
        # Python function that accept object, attribute for change and new_value
        setattr(user_object, attribute_name, new_value)
        commit()


    @classmethod
    def delete_user(cls, user_object):
        db.session.delete(user_object)
        commit()
