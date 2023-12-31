from config import db
from utils.db_utils import add_instance_no_commit, commit
from utils.enums import ProjectStatus
from utils.exceptions import CustomError
import re
from datetime import datetime
from sqlalchemy import DateTime
from packaging import version as package_version

class VersionProject(db.Model):
    __tablename__ = 'version_projects'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Enum(ProjectStatus), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    version = db.Column(db.String, nullable=False)
    created = db.Column(DateTime, default=datetime.utcnow, nullable=False)
    reports_project = db.relationship('Report', backref = "version_project")
    document_project = db.relationship('DocumentProject', backref = "version_project", cascade="all, delete-orphan")

    # Crea una versione associata ad un progetto, se il progetto non esiste con version = "v0.0.0"
    # controlla se la versione che sto provando ad aggiungere sia maggiore di tutte le altre versioni 
    # esistenti
    @classmethod
    def create_version(cls,status, project_id, version, document_project = []):
        if not re.match(r'^v\d+\.\d+\.\d+$', version):
            raise CustomError("Il formato della versione deve essere 'vX.Y.Z'", 400)
        
        versions = VersionProject.query.filter_by(project_id=project_id).all()
        if versions:
            for v in versions:
                if package_version.parse(v.version[1:]) >= package_version.parse(version[1:]):
                    raise CustomError("You can't create a version lower than the latest",400)
            project_version = cls(status=status,project_id=project_id, version=version)
        else:
            project_version = cls(status=ProjectStatus.TO_BE_SUBMITTED ,project_id=project_id,version="v0.0.0" )    
        project_version.created = datetime.utcnow()  # Imposta created all'ora corrente

        project_version.document_project = document_project
        
        add_instance_no_commit(project_version)

        return project_version

    @staticmethod
    def get_versions_by_project_id(proj_id):
        versions = VersionProject.query.filter_by(project_id=proj_id).all()
        sorted_projects = sorted(versions, key=lambda x: package_version.parse(x.version[1:]), reverse=True)

        if versions:
            return sorted_projects
        return None
    
    @staticmethod
    def get_version_by_id(id):
        version = VersionProject.query.filter_by(id=id).first()
        return version
    
    @staticmethod
    def get_latest_version(proj_id):
        versions = VersionProject.get_versions_by_project_id(proj_id)
        if versions:
            return versions[0]
        return None

    def update_status(self,status):
        self.status = status
        commit()
        return self
    
    def delete(self):
        try:
            db.session.delete(self)
            commit()
            return self
        except Exception as e:
            raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)
