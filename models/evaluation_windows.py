from config import db
from utils.exceptions import CustomError


class EvaluationWindow(db.Model):
    __tablename__ = 'evaluation_windows'

    id = db.Column(db.Integer, primary_key=True)
    data_start = db.Column(db.Date, nullable=False)
    data_end = db.Column(db.Date, nullable=False)
    project = db.relationship('Project', backref='evaluation_window')

    @staticmethod
    def add_window(data_start, data_end):
        try:
            window = EvaluationWindow(data_start=data_start, data_end=data_end)
            db.session.add(window)
            db.session.commit()
        except Exception as e:
            raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)
