from config import db
from models import EvaluationWindow
from models.project_documents import DocumentProject
from models.project_versions import VersionProject
from models.users import Researcher, User
from utils.exceptions import CustomError
from utils.enums import ProjectStatus


# aggiungere anche un attributo latest_version che ad ogni aggiornamento viene aggiornato
class Project(db.Model):
    __tablename__ = 'projects'
    # name='status_enum'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    latest_version = db.Column(db.Text, nullable=False)
    data_creation = db.Column(db.Date, nullable=False)
    status = db.Column(db.Enum(ProjectStatus), nullable=False)
    researcher_id = db.Column(db.Integer, db.ForeignKey('researchers.id'), nullable=False)
    evaluation_window_id = db.Column(db.Integer, db.ForeignKey('evaluation_windows.id'))
    assessment_reports = db.relationship('AssessmentReport', backref='project')
    version_project = db.relationship('VersionProject', backref='project')
    message = db.relationship('Message', backref='project')

    # TODO Fare error handling, try catch ecc !!!!!

    def submit(self):
        window = EvaluationWindow.get_current_window()
        if window is None:
            raise CustomError("There are no evaluation windows at the moment, try again later",500) 
        self.status = ProjectStatus.SUBMITTED
        self.evaluation_window_id = window.id
        version = VersionProject.get_versions_by_project_id(self.id)
        version[0].update_status(self.status)
        self.latest_version = version[0].version
        db.session.commit()
        return self

    def delete(self):
        try:
            db.session.delete(self)
            db.session.commit()
            return self
        except Exception as e:
            raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)

    def update_project_version(self, version):
        if self.status in [ProjectStatus.APPROVED,ProjectStatus.NOT_APPROVED,ProjectStatus.SUBMITTED]:
            raise CustomError("You can't update the project",403)
        v = VersionProject.create_version(self.status, self.id, version)
        self.latest_version = v.version
        db.session.commit()
        return v

    @classmethod
    def add_project(cls, name, description, data_creation, creator_user_id, files):
        project = cls(name=name, description=description, data_creation=data_creation,
                        researcher_id=creator_user_id, latest_version="v0.0.0")
        project.status = ProjectStatus.TO_BE_SUBMITTED
        db.session.add(project)
        db.session.commit()
        version = VersionProject.create_version(project.status,project.id,"v0.0.0")
        if files:
            for key, file in files.items(): #TODO qui handliamo piu file, dobbiamo cambiare il typedocument e il nome, il nome potremmo metterlo anche come key maybe 
                DocumentProject.create_document(name = file.filename, type_document="Mimmo",version_project_id=version.id, pdf_data=file.read() )
        return project

    @staticmethod
    def get_project_by_id(project_id):
        project = Project.query.filter_by(id=project_id).first()
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
            projects = VersionProject.query.filter_by(project_id=id).order_by(VersionProject.version.desc()).all()
            if projects:
                return projects
            raise CustomError("There are no projects with that id", 404) 

        except Exception as e:
            raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)
    
    @staticmethod
    def get_user_projects(user_id, project_id):
        project =   ( 
                        db.session.query(Project)
                        .join(Researcher, Researcher.id == Project.researcher_id)
                        .join(User, User.id == Researcher.user_id)
                        .filter(User.id == user_id, Project.id == project_id)
                        .all()
                    )
        if project:
            return project
        print(project)
        return None

    @staticmethod
    def get_user_from_project(project_id):
        user =   ( 
                        db.session.query(User)
                        .join(Researcher, Researcher.user_id == User.id)
                        .join(Project, Project.researcher_id == Researcher.id)
                        .filter(Project.id == project_id)
                        .one()
                    )
        db.session.commit()
        return user
    
      

