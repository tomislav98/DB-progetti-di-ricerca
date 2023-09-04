from config import db, app
from .users import User, UserType,Researcher, Evaluator
from .reports import AssessmentReport
from .project_versions import VersionProject
from .projects import Project
from .messages import Message
from .project_documents import DocumentProject
from .evaluation_windows import EvaluationWindow

with app.app_context():
    db.drop_all()
    db.create_all()
