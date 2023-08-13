from config import db, app
from .users import User, UserType,Researcher, Evaluator
from .project_versions import VersionProject
from .projects import Project
from .messages import Message
from .evaluations_windows import EvaluationPeriod

with app.app_context():
    db.drop_all()
    db.create_all()
