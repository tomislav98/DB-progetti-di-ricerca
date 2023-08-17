from config import db

class DocumentProject(db.Model):
    __tablename__ = 'documents_projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    type_document = db.Column(db.String(50), nullable=False)
    version = db.Column(db.String(50), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
