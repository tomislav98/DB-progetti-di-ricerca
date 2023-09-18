from config import db
from sqlalchemy import CheckConstraint
from utils.exceptions import CustomError
from datetime import datetime

class EvaluationWindow(db.Model):
    __tablename__ = 'evaluation_windows'

    id = db.Column(db.Integer, primary_key=True)
    data_start = db.Column(db.Date, nullable=False)
    data_end = db.Column(db.Date, CheckConstraint("data_end > data_start"), nullable=False)
    project = db.relationship('Project', backref='evaluation_window')
    

    @staticmethod
    def add_window(data_start, data_end):
        try:
            window = EvaluationWindow(data_start=data_start, data_end=data_end)
            db.session.add(window)
            db.session.commit()
        except Exception as e:
            raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)

    @staticmethod
    def get_first_window():
        try:
            windows = EvaluationWindow.query.all()
            if windows:
                closest_window = windows[0]
                for window in windows:
                    if window.data_start < window.data_end:
                        closest_window = window

                return closest_window
            return None
        except Exception as e:
            raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)
