import datetime
from config import db, bcrypt, app
from sqlalchemy import DateTime 

class AssessmentReport(db.Model):
    __tablename__ = 'assessment_reports'

    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    content = db.Column(db.Text, nullable=False)
    evaluator_id = db.Column(db.Integer, db.ForeignKey('evaluators.id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
