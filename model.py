import datetime
from enum import Enum
from sqlalchemy import DateTime
from config import db, bcrypt


class UserType(Enum):
    RESEARCHER = 'researcher'
    EVALUATOR = 'evaluator'


class User(db.Model):
    __tablename__ = 'users'
    # __table_args__ = {'schema': 'public'}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
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

            if type_user_enum == UserType.RESEARCHER:
                Researcher.add_researcher(user_id=user.id)

            elif type_user_enum == UserType.EVALUATOR:
                Evaluator.add_evaluator(user_id=user.id)
            else:
                # Gestione del tipo di utente sconosciuto o non valido
                raise ValueError("Unknown or invalid user type")
            db.session.commit()
        except Exception as e:
            print(f"Errore: {type(e).__name__} - {e}")

    # def __repr__(self):
    #     return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"


class Researcher(db.Model):
    __tablename__ = 'researchers'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
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
        researcher = cls(user_id=user_id)
        db.session.add(researcher)

    #  password from user passed on login


class Evaluator(db.Model):
    __tablename__ = 'evaluators'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    projects = db.relationship('ProjectsToValue', backref='evaluator')
    message = db.relationship('Message', backref='evaluator')
    assessment_reports = db.relationship('AssessmentReport', backref='evaluator')
    version_document = db.relationship('VersionDocument', backref='evaluator')

    @classmethod
    def add_evaluator(cls, user_id):
        evaluator = cls(name=user_id)
        db.session.add(evaluator)


"""Define one to many relationships 
    between Project and researcher,
    one researcher have many projects."""


class Project(db.Model):
    __tablename__ = 'projects'
    # name='status_enum'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    data_creation = db.Column(db.Date, nullable=False)
    # status = db.Column(db.Enum('approved', 'submitted_for_evaluation', 'requires_changes',
    #                            'not_approved', name='status_enum'), nullable=False)
    # the 'researchers.id' that I created need to be just interpreted for developer.
    researcher_id = db.Column(db.Integer, db.ForeignKey('researchers.id'))
    assessment_reports = db.relationship('AssessmentReport', backref='project')
    document_project = db.relationship('DocumentProject', backref='project')
    version_project = db.relationship('VersionProject', backref='project')
    evaluation_period = db.relationship('EvaluationPeriod', backref='project')
    message = db.relationship('Message', backref='project')

    @classmethod
    def add_project(cls, name, description, data_creation):
        project = cls(name=name, description=description, data_creation=data_creation)
        db.session.add(project)
        db.session.commit()


"""Define one to one relationships(partial) 
    between Project and ProjectsToValue,
    one projects can be also not valued yet."""


class ProjectsToValue(db.Model):
    __tablename__ = 'projects_to_values'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    data_created = db.Column(db.String(50), nullable=False)
    vote = db.Column(db.String(50), nullable=False)
    # unique=True mean that ProjectsToValue doesn't need to have all 'projects for value' and the value can be null
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), unique=True, nullable=True)
    evaluator_id = db.Column(db.Integer, db.ForeignKey('evaluators.id'))


"""Define one to many relationships(partial) 
    between Evaluator and ProjectsToValue,
    one projects can be also not valued yet."""


class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    type_message = db.Column(db.String(50), nullable=False)
    version = db.Column(db.String(50), nullable=False)
    msg = db.Column(db.Text, nullable=False)
    # one researcher could not have no msgs
    researcher_id = db.Column(db.Integer, db.ForeignKey('researchers.id'), nullable=True)
    evaluator_id = db.Column(db.Integer, db.ForeignKey('evaluators.id'), nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)
    # TODO devo aggiungere le foreign_key


class VersionProject(db.Model):
    __tablename__ = 'version_projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    # TODO
    # status = db.Column(db.Enum('approved', 'submitted_for_evaluation', 'requires_changes',
    #                            'not_approved', name='status_enum'), nullable=False)

    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))


class AssessmentReport(db.Model):
    __tablename__ = 'assessment_reports'

    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    content = db.Column(db.Text, nullable=False)
    evaluator_id = db.Column(db.Integer, db.ForeignKey('evaluators.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))


class VersionDocument(db.Model):
    __tablename__ = 'version_documents'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    type_document = db.Column(db.String(50), nullable=False)
    version = db.Column(db.String(50), nullable=False)
    document_project_id = db.Column(db.Integer, db.ForeignKey('documents_projects.id'))
    evaluator_id = db.Column(db.Integer, db.ForeignKey('evaluators.id'))


class DocumentProject(db.Model):
    __tablename__ = 'documents_projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    type_document = db.Column(db.String(50), nullable=False)
    version = db.Column(db.String(50), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    version_document = db.relationship('VersionDocument', backref='documents_project')


class EvaluationPeriod(db.Model):
    __tablename__ = 'evaluation_period'

    id = db.Column(db.Integer, primary_key=True)
    data_start = db.Column(db.Date, nullable=False)
    data_end = db.Column(db.Date, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
