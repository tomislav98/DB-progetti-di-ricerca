from enum import Enum
from sqlalchemy import DateTime
from config import db, bcrypt
from utils.db_utils import add_instance, add_instance_no_commit, commit
from utils.exceptions import CustomError

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

# Aggiungere numero di telefono
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    type_user = db.Column(db.Enum(UserType))  # discriminator attribute

    researcher = db.relationship('Researcher', backref='user', uselist=False, cascade='all, delete-orphan')
    evaluator = db.relationship('Evaluator', backref='user', uselist=False, cascade='all, delete-orphan')

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

        if type_user_enum == UserType.RESEARCHER:
            Researcher.add_researcher(user_id=user.id)

        elif type_user_enum == UserType.EVALUATOR:
            Evaluator.add_evaluator(user_id=user.id)
            
        elif type_user_enum == UserType.ADMIN:
            print("Admin added")
        else:
            # Gestione del tipo di utente sconosciuto o non valido
            raise ValueError("Unknown or invalid user type")

       

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


class Researcher(db.Model):
    __tablename__ = 'researchers'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True,
                        nullable=False)  # sistemare ondelete='CASCADE',

    projects = db.relationship('Project', backref='researcher')

    def delete_researcher(self):
        db.session.delete(self)
        commit()
        return self
        
    @classmethod
    def add_researcher(cls, user_id):
        researcher = Researcher(user_id=user_id)
        add_instance(researcher)
    
    @staticmethod
    def get_researcher_from_id(id):
        researcher = Researcher.query.filter_by(id=id).first()
        if researcher:
            return researcher
        else:
            raise CustomError("User is not a researcher therefore it cannot create a new project (if you are an admin and want to create a project for a researcher you can user /researchers/project endpoint)",404)
    

    @staticmethod
    def get_researcher_from_user_id(user_id):
        researcher = Researcher.query.filter_by(user_id=user_id).first()
        if researcher :
            return researcher
        else:
            raise CustomError("User is not a researcher therefore it cannot create a new project (if you are an admin and want to create a project for a researcher you can user /researchers/project endpoint)",404)
    
    @staticmethod
    def is_valid_researcher(data):
        """Function that verify if researcher that is loging is valid."""
        # Need to verify that email could exist, and if mail NOT exist then rise an error
        is_email_found = User.query.filter_by(email=data['email']).first()
        # Need to verify that hash password could exist, and if hash password NOT exist then rise an error
        hash_list = User.get_all_password_hashes_from_db('researcher')
        is_password_found = False
        for password_hash in hash_list:
            if User.check_password(password_hash, data['password']):
                is_password_found = True
                break
    
        if is_email_found and is_password_found:
            return True
        return False


class Evaluator(db.Model):
    __tablename__ = 'evaluators'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True,
                        nullable=False)  # sistemare ondelete='CASCADE',
    report = db.relationship('Report', backref='evaluator')

    @classmethod
    def add_evaluator(cls, user_id):
        evaluator = Evaluator(user_id=user_id)
        add_instance(evaluator)

    @staticmethod
    def is_valid_evaluator(data):
        """Function that verify if evaluator that is loging is valid."""
        # Need to verify that email could exist, and if mail NOT exist then rise an error
        is_email_found = User.query.filter_by(email=data['email']).first()
        # Need to verify that hash password could exist, and if hash password NOT exist then rise an error
        hash_list = User.get_all_password_hashes_from_db('evaluator')
        is_password_found = False
        for password_hash in hash_list:
            if User.check_password(password_hash, data['password']):
                is_password_found = True
                break

        if is_email_found and is_password_found:
            return True
        return False

