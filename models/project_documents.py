from datetime import datetime
from config import db
from utils.db_utils import *

class DocumentProject(db.Model):
    __tablename__ = 'documents_projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    type_document = db.Column(db.String(50), nullable=False)
    version_project_id = db.Column(db.Integer, db.ForeignKey('version_projects.id'))
    pdf_data = db.Column(db.LargeBinary, nullable=False)
    created=db.Column(db.Date, nullable=False)

    @classmethod
    def create_document(cls, name, type_document, version_project_id, pdf_data, created=datetime.now().date()):
        document = cls(name=name, type_document=type_document, version_project_id=version_project_id, pdf_data=pdf_data, created=created)
        add_instance(document)
    
    @staticmethod
    def get_documents_by_version_project_id(version_project_id):
        document = DocumentProject.query.filter_by(version_project_id=version_project_id).all()
        return document
