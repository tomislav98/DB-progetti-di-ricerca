from config import db
from sqlalchemy import CheckConstraint, event
from utils.db_utils import add_instance, commit
from utils.exceptions import CustomError
from utils.dates import str2date
from datetime import datetime

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
        if parsed_start < datetime.now().date():
                raise CustomError("Invalid input, start date cannot be in the past", 400)
        overlapping_windows = EvaluationWindow.query.filter(
            ((parsed_start >= EvaluationWindow.data_start) & (parsed_start <= EvaluationWindow.data_end)) |
            ((parsed_end >= EvaluationWindow.data_start) & (parsed_end <= EvaluationWindow.data_end)) |
            ((parsed_start <= EvaluationWindow.data_start) & (parsed_end >= EvaluationWindow.data_end))
        ).all()
        if overlapping_windows:
            raise CustomError("The new evaluation window overlaps with an existing window.", 400)
        window = EvaluationWindow(data_start=parsed_start, data_end=parsed_end)
        add_instance(window);

    @staticmethod
    def get_current_window():
        now = datetime.now().date()
        windows = EvaluationWindow.query.filter(EvaluationWindow.data_start <= now, EvaluationWindow.data_end >= now).first()
        return windows
    
    @staticmethod
    def get_next_window():
        now = datetime.now().date()
        windows = EvaluationWindow.query.filter(EvaluationWindow.data_start > now).order_by(EvaluationWindow.data_end.desc()).first()
        return windows
    
    @classmethod
    def get_evaluation_windows_projects(cls, evaluation_window_id):
        projects = db.session.query(EvaluationWindow).get(evaluation_window_id).projects
        if projects:
            return projects
        return None
    
    @classmethod
    def delete_first_window(cls):
        evaluation_window = cls.get_current_window()
        db.session.delete(evaluation_window)
        commit()




