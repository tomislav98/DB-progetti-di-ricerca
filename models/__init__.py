from config import db, app
from .users import User, UserType
from .reports import Report
from .evaluation_windows import EvaluationWindow
from .project_versions import VersionProject
from .projects import Project
from  utils.populate import populate_users
from .project_documents import DocumentProject

with app.app_context():
    # db.drop_all()
    db.create_all()
    # populate_users(db.session)