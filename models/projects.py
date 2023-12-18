from config import db
from models import EvaluationWindow
from models.project_documents import DocumentProject
from models.project_versions import VersionProject
from models.users import User
from utils.db_utils import add_instance, commit, flush
from utils.exceptions import CustomError
from utils.enums import ProjectStatus
from utils.versions import get_incremented_version
from packaging import version as package_version

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    latest_version = db.Column(db.Text, nullable=False)
    data_creation = db.Column(db.Date, nullable=False)
    status = db.Column(db.Enum(ProjectStatus), nullable=False)
    researcher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    evaluation_window_id = db.Column(db.Integer, db.ForeignKey('evaluation_windows.id'))
    version_project = db.relationship('VersionProject', backref='project')

    @classmethod
    def add_project(cls, name, description, data_creation, creator_user_id, files):
        project = cls(name=name, description=description, data_creation=data_creation,
                        researcher_id=creator_user_id, latest_version="v0.0.0")
        project.status = ProjectStatus.TO_BE_SUBMITTED
        add_instance(project)
        version = VersionProject.create_version(project.status,project.id,"v0.0.0")
        flush()
        if files:
            for file in files:
               DocumentProject.create_document(name = file.filename, type_document='UNDEFINED',version_project_id=version.id, pdf_data=file.read() )
        commit()
        return project

    @staticmethod
    def get_project_by_id(project_id):
        project = Project.query.filter_by(id=project_id).first()
        if project:
            return project
        return None

    # TODO: latest come relationship invece che come testo?
    def submit(self):
        # cerca la prossima finestra di valutazione se esiste
        window = EvaluationWindow.get_next_window()
        if window is None:
            raise CustomError("There are no evaluation windows at the moment, try again later",500) 
        
        # setta lo stato a SUBMITTED
        self.status = ProjectStatus.SUBMITTED
        self.evaluation_window_id = window.id
        
        # se non specificata una nuova versione incrementa il campo "patch" della versione
        new_version_string = get_incremented_version(self.latest_version)

        # fa una copia della versione che si voleva sottoporre a valutazione e la crea 
        latest_version = VersionProject.get_latest_version(self.id)
        v = VersionProject.create_version(ProjectStatus.SUBMITTED,self.id,new_version_string)

        for proj in latest_version.document_project:
            DocumentProject.create_document(proj.name, proj.type_document, v.id, proj.pdf_data, proj.created )

        self.latest_version = new_version_string
        commit()

        return self

    def withdraw(self):

        window = EvaluationWindow.get_next_window()
        project_to_remove = next((project for project in window.project if project.id == self.id), None)
        if project_to_remove:
            window.project.remove(project_to_remove)

        version = VersionProject.get_latest_version(self.id)
        version.delete()
        commit()

        oldVersion = VersionProject.get_latest_version(self.id)
        self.status = oldVersion.status
        self.latest_version = oldVersion.version
        commit()


        return version

    def delete(self):
        try:
            db.session.delete(self)
            commit()
            return self
        except Exception as e:
            raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)


    #   documentsForm = { [{"filename":"mimmo","title": "Mimmo", "type":"DATA_MANAGEMENT_PLAN", pdf_data:"dfkjahdfkjahsdfkjhas"}] }
    def update_project_version(self, documentsForm, name = None, description = None, version = None):            

        v = VersionProject.create_version(self.status, self.id, version)
        flush()
        for doc in documentsForm:
            DocumentProject.create_document(doc['title'], doc['type'], v.id, doc['pdf_data'])
        # fine test

        self.latest_version = v.version
        self.name = name if name is not None else self.name
        self.description = description if description is not None else self.description
        commit()
        return v

    
    def delete_project(self, project_id):
        project = Project.query.filter_by(id=project_id).first()
        if project:
            return project
        return None

    @staticmethod
    def get_project_versions_list(id):
        try:
            projects = VersionProject.query.filter_by(project_id=id).order_by(VersionProject.version.desc()).all()
            
            sorted_projects = sorted(projects, key=lambda x: package_version.parse(x.version[1:]), reverse=True)
            
            if projects:
                return sorted_projects
            raise CustomError("There are no projects with that id", 404) 

        except Exception as e:
            raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)
    
    @staticmethod
    def get_user_project_by_id(user_id, project_id):
        project =   ( 
            db.session.query(Project)
            .filter(Project.researcher_id == user_id, Project.id == project_id)
            .first()
                    )
        if project:
            return project
        return None

    @staticmethod
    def get_user_from_project(project_id):
        user =   ( 
                        db.session.query(User)
                        .join(Project, Project.researcher_id == User.id)
                        .filter(Project.id == project_id)
                        .one()
                    )
        return user
    
    def get_latest_version(self):
        latest = VersionProject.get_latest_version(self.id)
        return latest
      

