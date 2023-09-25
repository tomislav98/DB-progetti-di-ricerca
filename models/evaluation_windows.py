from config import db
from sqlalchemy import CheckConstraint, event
from utils.exceptions import CustomError
from utils.dates import str2date
from datetime import datetime


# TODO controllare (con un check forse?) prima di creare un evaluation window che la data non sia precedente alla
#  data di oggi controllare anche alla creazione che non ci siano finestre di valutazione sovrapposte btw il check
#  date_end > data_start non sembra funzionare

class EvaluationWindow(db.Model):
    __tablename__ = 'evaluation_windows'

    id = db.Column(db.Integer, primary_key=True)
    data_start = db.Column(db.Date, nullable=False)
    data_end = db.Column(db.Date, CheckConstraint("data_end > data_start"), nullable=False)
    project = db.relationship('Project', backref='evaluation_window')

    @staticmethod
    def get_by_id(window_id):
        try:
            window = EvaluationWindow.query.filter_by(id=window_id).first()
            if window:
                return window
            return None
        except Exception as e:
            raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)


    # Crea la prima finestra indipendentemente dalla data messa, 
    # le altre solo se la data di inizio non è nel passato 
    @staticmethod
    def add_window(date_start, date_end):
        parsed_start = str2date(date_start)
        parsed_end = str2date(date_end)
        current_evaluation_window = EvaluationWindow.get_first_window()
        if hasattr(current_evaluation_window, "data_end"):
            if parsed_start < datetime.now().date():
                raise CustomError("Invalid input, start date cannot be in the past", 400)
            if parsed_start < current_evaluation_window.data_end:
                raise CustomError("Invalid input, window is overlapping the current one", 400)
        window = EvaluationWindow(data_start=parsed_start, data_end=parsed_end)
        db.session.add(window)
        db.session.commit()

    @staticmethod
    def get_first_window():
        windows = EvaluationWindow.query.order_by(EvaluationWindow.data_end.desc()).first()
        return windows

    @classmethod
    def delete_first_window(cls):
        evaluation_window = cls.get_first_window()
        db.session.delete(evaluation_window)
        db.session.commit()



