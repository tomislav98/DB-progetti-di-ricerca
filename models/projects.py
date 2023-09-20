from config import db
from models import EvaluationWindow
from models.project_versions import VersionProject
from utils.exceptions import CustomError
from utils.enums import ProjectStatus

class Project(db.Model):
    __tablename__ = 'projects'
    # name='status_enum'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    data_creation = db.Column(db.Date, nullable=False)
    status = db.Column(db.Enum(ProjectStatus), nullable=False)
    researcher_id = db.Column(db.Integer, db.ForeignKey('researchers.id'), nullable=False)
    evaluation_window_id = db.Column(db.Integer, db.ForeignKey('evaluation_windows.id'))
    assessment_reports = db.relationship('AssessmentReport', backref='project')
    document_project = db.relationship('DocumentProject', backref='project')
    version_project = db.relationship('VersionProject', backref='project')
    message = db.relationship('Message', backref='project')

    # TODO Fare error handling, try catch ecc !!!!!

    def submit(self):
        window = EvaluationWindow.get_first_window().id
        self.status = ProjectStatus.SUBMITTED
        self.evaluation_window_id = window
        # db.session.add(self)
        db.session.commit()
        return self

    def delete(self):
        try:
            db.session.delete(self)
            db.session.commit()
            return self
        except Exception as e:
            raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)

    @classmethod
    def add_project(cls, name, description, data_creation, creator_user_id):
        try:
            project = cls(name=name, description=description, data_creation=data_creation,
                          researcher_id=creator_user_id)
            project.status = ProjectStatus.TO_BE_SUBMITTED
            db.session.add(project)
            db.session.commit()

        except Exception as e:
            raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)

    @staticmethod
    def get_project_by_id(project_id):
        project = Project.query.filter_by(id=project_id).first()
        if project:
            return project
        return None

    @staticmethod
    def get_project_by_window_id(evaluation_window_id):
        project = db.session.query(Project).filter_by(evaluation_window_id=evaluation_window_id).all()
        if project:
            return project
        return None

    def delete_project(self, project_id):
        project = Project.query.filter_by(id=project_id).first()
        if project:
            return project
        return None

    @staticmethod
    def get_project_versions_list(id):
        try:
            
            projects = VersionProject.query.filter_by(project_id=id).all()

            if projects:
                return projects
            raise CustomError("There are no projects with that id", 404) 

        except Exception as e:
            raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)
        
