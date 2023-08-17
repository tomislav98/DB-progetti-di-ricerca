from enum import Enum
from sqlalchemy import DateTime
from config import db, bcrypt

class UserType(Enum):
    RESEARCHER = 'researcher'
    EVALUATOR = 'evaluator'

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
    def add_user(cls, name, surname, email, password, type_user):
        try:
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            type_user_enum = UserType.RESEARCHER
            if type_user == UserType.EVALUATOR:
                type_user_enum = UserType.EVALUATOR
            user = cls(name=name, surname=surname, email=email, password=hashed_password, type_user=type_user_enum)
            db.session.add(user)
            db.session.commit()

            if type_user_enum == UserType.RESEARCHER:
                Researcher.add_researcher(user_id=user.id)

            elif type_user_enum == UserType.EVALUATOR:
                Evaluator.add_evaluator(user_id=user.id)
            else:
                # Gestione del tipo di utente sconosciuto o non valido
                raise ValueError("Unknown or invalid user type")

        except Exception as e:
            print(f"Errore: {type(e).__name__} - {e}")

    @classmethod
    def update_user(cls, user_object, attribute_name, new_value):
        # Python function that accept object, attribute for change and new_value
        setattr(user_object, attribute_name, new_value)
        db.session.commit()

    @classmethod
    def delete_user(cls, user_object):
        db.session.delete(user_object)
        db.session.commit()

    @staticmethod
    def get_all_password_hashes_from_db(type_user):
        """ its generic function that return all password of researcher or evaluator"""
        # Recupera tutte le password hash dalla tabella User
        if type_user == 'researcher':
            researchers = Researcher.query.all()
            return [researcher.password for researcher in researchers]
        elif type_user == 'evaluator':
            evaluators = Evaluator.query.all()
            return [evaluator.password for evaluator in evaluators]
        else:
            print('Something is wrong in function get_all_password_hashes_from_db()!')

    @staticmethod
    def check_password(hashed_password, password):
        """ function that return True if password inserted by user is matching the hashcode."""
        # return app.bcrypt.check_password_hash(hashed_password, password)
        return bcrypt.check_password_hash(hashed_password, password)

    # def __repr__(self):
    #     return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"


class Researcher(db.Model):
    __tablename__ = 'researchers'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False) # sistemare ondelete='CASCADE',
    # backref='researcher' add researcher attribute to Project model,
    # in that way I can use this attribute on any instance of Project
    # that create a list of projects that have one researcher
    projects = db.relationship('Project', backref='researcher')
    message = db.relationship('Message', backref='researcher')

    # esiste anche quello personalizzato
    # def __init__(self, name='', surname='', email='', password=''):
    #     self.name = name
    #     self.surname = surname
    #     self.email = email
    #     self.password_hash = password

    @classmethod
    def add_researcher(cls, user_id):
        researcher = Researcher(user_id=user_id)
        db.session.add(researcher)
        db.session.commit()

    @staticmethod
    def is_valid_researcher(data):
        """Function that verify if researcher that is loging is valid."""
        # Need to verify that email could exist, and if mail NOT exist then rise an error
        is_email_found = Researcher.query.filter_by(email=data['email']).first()
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

    # @classmethod
    # def update_researcher(cls, researcher, attribute_name, new_value):
    #     # Python function that accept object, attribute for change and new_value
    #     setattr(researcher, attribute_name, new_value)
    #     db.session.commit()
    #  password from user passed on login

class Evaluator(db.Model):
    __tablename__ = 'evaluators'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False) # sistemare ondelete='CASCADE',
    message = db.relationship('Message', backref='evaluator')
    assessment_reports = db.relationship('AssessmentReport', backref='evaluator')

    @classmethod
    def add_evaluator(cls, user_id):
        evaluator = Evaluator(user_id=user_id)
        db.session.add(evaluator)
        db.session.commit()

    @staticmethod
    def is_valid_evaluator(data):
        """Function that verify if evaluator that is loging is valid."""
        # Need to verify that email could exist, and if mail NOT exist then rise an error
        is_email_found = Evaluator.query.filter_by(email=data['email']).first()
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




