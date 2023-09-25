from config import db
from models.projects import Project
from models.evaluation_windows import EvaluationWindow
from sqlalchemy import event
from utils.exceptions import CustomError


@event.listens_for(EvaluationWindow, "before_delete")
def before_delete_trigger(mapper, connection, target):
    evaluation_window_id = target.id
    related_project = db.session.query(Project).filter_by(evaluation_window_id = evaluation_window_id).first()
    print(db.session)
    mimmo = db.session.query(Project).filter_by(id = 2).all()
    print(mimmo)
    print(related_project)
    if related_project : 
        raise CustomError("Cannot delete Evaluation Window as it is associated with a Project.", 409)
    raise CustomError("Cannot delete Evaluation Window ascsdsdfsdfsds it is associated with a Project.", 409)
    