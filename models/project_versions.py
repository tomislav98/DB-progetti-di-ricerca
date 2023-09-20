from config import db
from models.projects import ProjectStatus


class VersionProject(db.Model):
    __tablename__ = 'version_projects'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Enum(ProjectStatus), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    version = db.Column(db.String, nullable=False)