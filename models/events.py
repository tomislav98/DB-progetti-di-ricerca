from sqlalchemy import event
from config import db
from models.projects import Project
from models.evaluation_windows import EvaluationWindow
from utils.exceptions import CustomError


@event.listens_for(EvaluationWindow, "before_delete")
def before_delete_trigger(mapper, connection, target):
    if target.project: 
        raise CustomError("Cannot delete Evaluation Window as it is associated with a Project.", 409)    
