from flask_sqlalchemy import SQLAlchemy
import os
from flask import Flask
from flask_migrate import Migrate
import datetime
from sqlalchemy import Column, Integer, DateTime, Enum

basedir = os.path.abspath(os.path.dirname(__file__))
# + os.path.join(basedir, 'data.pgdb')
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = \
    'postgresql://Aesee8oonaich7:oojaiqu8peuTae@157.230.29.227:7794/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # needed for performance

db = SQLAlchemy(app)
migrate = Migrate(app, db)


class User(db.Model):
    __tablename__ = 'users'
    __table_args__ = {'schema': 'public'}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"

    # @classmethod  # cls è esattamente come il self nei class methods
    # def add_user(cls, username, email, password):
    #     db.metadata.create_all(engine)  # crea la tabella se non esiste
    #     session = Session(bind=engine)
    #     user = cls(username=username, email=email, password=password)
    #     session.add(user)
    #     session.commit()
    #     session.close()


"""Define one to many relationships 
    between Project and researcher,
    one researcher have many projects."""


class Project(db.Model):
    __tablename__ = 'projects'
    # name='status_enum'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    # status = db.Column(db.Enum('approved', 'submitted_for_evaluation', 'requires_changes',
    #                            'not_approved', name='status_enum'), nullable=False)
    # the 'researchers.id' that I created need to be just interpreted for developer.
    researcher_id = db.Column(db.Integer, db.ForeignKey('researchers.id'))
    assessment_reports = db.relationship('AssessmentReport', backref='project')
    document_project = db.relationship('DocumentProject', backref='project')
    version_project = db.relationship('VersionProject', backref='project')
    evaluation_period = db.relationship('EvaluationPeriod', backref='project')
    message = db.relationship('Message', backref='project')


class Researcher(db.Model):
    __tablename__ = 'researchers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50), nullable=False)
    email_researcher = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)
    # backref='researcher' add researcher attribute to Project model,
    # in that way I can use this attribute on any instance of Project
    # that create a list of projects that have one researcher
    projects = db.relationship('Project', backref='researcher')
    message = db.relationship('Message', backref='researcher')


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


class Evaluator(db.Model):
    __tablename__ = 'evaluators'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    surname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=False)
    projects = db.relationship('ProjectsToValue', backref='evaluator')
    message = db.relationship('Message', backref='evaluator')
    assessment_reports = db.relationship('AssessmentReport', backref='evaluator')
    version_document = db.relationship('VersionDocument', backref='evaluator')


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


with app.app_context():
    db.create_all()
