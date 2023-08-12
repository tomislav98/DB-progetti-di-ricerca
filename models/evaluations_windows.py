from config import db

class EvaluationPeriod(db.Model):
    __tablename__ = 'evaluation_period'

    id = db.Column(db.Integer, primary_key=True)
    data_start = db.Column(db.Date, nullable=False)
    data_end = db.Column(db.Date, nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
