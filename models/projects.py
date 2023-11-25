from config import db
from models import EvaluationWindow
from models.project_documents import DocumentProject
from models.project_versions import VersionProject
from models.users import Researcher, User
from utils.db_utils import add_instance, add_instance_no_commit, commit, flush
from utils.exceptions import CustomError
from utils.enums import ProjectStatus
from packaging import version as package_version

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
    version_project = db.relationship('VersionProject', backref='project')

    # TODO: per adesso si submitta nella prossima finestra di valutazione(quella che ci sta subito dopo) 
    # TODO: latest come relationship invece che come testo?
    def submit(self):
        window = EvaluationWindow.get_next_window()
        if window is None:
            raise CustomError("There are no evaluation windows at the moment, try again later",500) 
        
        self.status = ProjectStatus.SUBMITTED
        self.evaluation_window_id = window.id
        
        current_version_parts = self.latest_version.split('.')
        last_number = int(current_version_parts[-1])

        new_last_number = last_number + 1

        new_version_parts = current_version_parts[:-1]  # Mantieni tutte le parti tranne l'ultima
        new_version_parts.append(str(new_last_number))  # Aggiungi il nuovo numero
        new_version_string = '.'.join(new_version_parts)

        # testare se la submit crea una copia dei docs associati alla nuova versione

        latest_version = VersionProject.get_latest_version(self.id)
        v = VersionProject.create_version(ProjectStatus.SUBMITTED,self.id,new_version_string)

        for proj in latest_version.document_project:
            DocumentProject.create_document(proj.name, proj.type_document, v.id, proj.pdf_data, proj.created )

        # fine test qui 

        self.latest_version = new_version_string
        commit()

        return self

    def withdraw(self):

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
    def update_project_version(self, documentsForm,  version = None):
        
        # TODO controllare se c'e un metodo piu sound per fare sta cosa, sto cercando la latest version del progetto attraverso get_latest_version(self.id) e fornendo latest_version.document_project
       
        # testare
        latest_version = VersionProject.get_latest_version(self.id)
            

        v = VersionProject.create_version(self.status, self.id, version)
        flush()
        for doc in documentsForm:
            print(v)
            DocumentProject.create_document(doc['title'], doc['type'], v.id, doc['pdf_data'])
        # fine test

        self.latest_version = v.version
        commit()
        return v

    @classmethod
    def add_project(cls, name, description, data_creation, creator_user_id, files):
        project = cls(name=name, description=description, data_creation=data_creation,
                        researcher_id=creator_user_id, latest_version="v0.0.0")
        project.status = ProjectStatus.TO_BE_SUBMITTED
        add_instance(project)
        version = VersionProject.create_version(project.status,project.id,"v0.0.0")
        flush()
        if files:
            for file in files: #TODO qui handliamo piu file, dobbiamo cambiare il typedocument e il nome, il nome potremmo metterlo anche come key maybe 
               DocumentProject.create_document(name = file.filename, type_document='UNDEFINED',version_project_id=version.id, pdf_data=file.read() )
        commit()
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
                        .join(Researcher, Researcher.id == Project.researcher_id)
                        .join(User, User.id == Researcher.user_id)
                        .filter(User.id == user_id, Project.id == project_id)
                        .first()
                    )
        if project:
            return project
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
        commit()
        return user
    
      

