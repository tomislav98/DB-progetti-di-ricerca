from config import db, app
from .users import User, UserType,Researcher, Evaluator
from .reports import AssessmentReport
from .evaluation_windows import EvaluationWindow
from .project_versions import VersionProject
from .projects import Project
from  utils.populate import populate_users
from .messages import Message
from .project_documents import DocumentProject
from . import events

with app.app_context():
    from . import events
    # db.drop_all()
    db.create_all()
    populate_users(db.session)