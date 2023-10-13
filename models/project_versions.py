from config import db
from utils.enums import ProjectStatus
from utils.exceptions import CustomError
import re
from datetime import datetime
from sqlalchemy import DateTime

class VersionProject(db.Model):
    __tablename__ = 'version_projects'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Enum(ProjectStatus), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    version = db.Column(db.String, nullable=False)
    document_project = db.relationship('DocumentProject', backref = "version_project")
    created = db.Column(DateTime, default=datetime.utcnow, nullable=False)

    # Crea una versione associata ad un progetto, se il progetto non esiste con version = "v0.0.0"
    # controlla se la versione che sto provando ad aggiungere sia maggiore di tutte le altre versioni 
    # esistenti
    @classmethod
    def create_version(cls,status, project_id, version):
        if not re.match(r'^v\d+\.\d+\.\d+$', version):
            raise CustomError("Il formato della versione deve essere 'vX.X.X'", 400)
        
        versions = VersionProject.query.filter_by(project_id=project_id).all()

        if versions:
            for v in versions:
                if v.version >= version:
                    raise CustomError("You can't create a version lower than the latest",400)
            project_version = cls(status=status,project_id=project_id, version=version)
        else:
            project_version = cls(status=ProjectStatus.TO_BE_SUBMITTED ,project_id=project_id,version="v0.0.0" )    
        project_version.created = datetime.utcnow()  # Imposta created all'ora corrente
        db.session.add(project_version)
        db.session.commit()

        return project_version

    @staticmethod
    def get_versions_by_project_id(proj_id):
        versions = VersionProject.query.filter_by(project_id=proj_id).order_by(VersionProject.version.desc()).all()

        if versions:
            return versions
        raise CustomError("Data not available", 404)
    
    def update_status(self,status):
        self.status = status
        db.session.commit()
        return self