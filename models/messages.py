from config import db


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
