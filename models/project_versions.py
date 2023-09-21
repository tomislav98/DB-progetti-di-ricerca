from config import db
from utils.enums import ProjectStatus
from utils.exceptions import CustomError

class VersionProject(db.Model):
    __tablename__ = 'version_projects'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.Enum(ProjectStatus), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    version = db.Column(db.String, nullable=False)

    # Crea una versione associata ad un progetto, se il progetto non esiste con version = "v0.0.0"
    # controlla se la versione che sto provando ad aggiungere sia maggiore di tutte le altre versioni 
    # esistenti
    @classmethod
    def create_version(cls,status, project_id, version):
        try:
            otherversions = VersionProject.query.filter_by(project_id=project_id).all()

            if otherversions:
                for v in otherversions:
                    if v.version > version:
                        raise CustomError("You can't create a version lower than the latest",400)
                project_version = cls(status=status,project_id=project_id, version=version)
            else:
                project_version = cls(status=ProjectStatus.TO_BE_SUBMITTED ,project_id=project_id,version="v0.0.0" )    

            db.session.add(project_version)
            db.session.commit()
        except Exception as e:
            raise CustomError(f"Errore: {type(e).__name__} - {e}", 500)
