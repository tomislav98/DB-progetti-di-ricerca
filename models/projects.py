from config import db
from enum import Enum


class ProjectStatus(Enum):
    APPROVED = 0
    SUBMITTED = 1
    REQUIRES_CHANGES = 2
    NOT_APPROVED = 3
    TO_BE_SUBMITTED = 4


class Project(db.Model):
    __tablename__ = 'projects'
    # name='status_enum'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    data_creation = db.Column(db.Date, nullable=False)
    status = db.Column(db.Enum(ProjectStatus), nullable=False)
    researcher_id = db.Column(db.Integer, db.ForeignKey('researchers.id'), nullable=False)
    evaluation_window_id = db.Column(db.Integer, db.ForeignKey('evaluation_windows.id'))
    assessment_reports = db.relationship('AssessmentReport', backref='project')
    document_project = db.relationship('DocumentProject', backref='project')
    version_project = db.relationship('VersionProject', backref='project')
    message = db.relationship('Message', backref='project')

    @classmethod
    def add_project(cls, name, description, data_creation, creator_user_id):
        project = cls(name=name, description=description, data_creation=data_creation, researcher_id=creator_user_id, status=ProjectStatus.TO_BE_SUBMITTED)
        db.session.add(project)
        db.session.commit()
