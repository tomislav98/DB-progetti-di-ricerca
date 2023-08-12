from config import db

class Evaluator(db.Model):
    __tablename__ = 'evaluators'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False) # sistemare ondelete='CASCADE',
    projects = db.relationship('ProjectsToValue', backref='evaluator')
    message = db.relationship('Message', backref='evaluator')
    assessment_reports = db.relationship('AssessmentReport', backref='evaluator')
    version_document = db.relationship('VersionDocument', backref='evaluator')

    @classmethod
    def add_evaluator(cls, user_id):
        evaluator = Evaluator(user_id=user_id)
        db.session.add(evaluator)
        db.session.commit()

"""Define one to many relationships 
    between Project and researcher,
    one researcher have many projects."""
