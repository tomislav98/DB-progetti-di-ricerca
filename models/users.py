from enum import Enum
from sqlalchemy import DateTime
from config import db, bcrypt, app
from researchers import Researcher 
from evaluators import Evaluator

class UserType(Enum):
    RESEARCHER = 'researcher'
    EVALUATOR = 'evaluator'

class User(db.Model):
    __tablename__ = 'users'
    # __table_args__ = {'schema': 'public'}

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

    # def __repr__(self):
    #     return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"
