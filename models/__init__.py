from config import db, app
from .users import User, UserType
from .researchers import Researcher
from .evaluators import Evaluator
from .projects import Project
from .messages import Message
from .evaluations_windows import EvaluationPeriod

with app.app_context():
    db.create_all()
