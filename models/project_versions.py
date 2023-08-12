from config import db

class VersionProject(db.Model):
    __tablename__ = 'version_projects'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    # TODO
    # status = db.Column(db.Enum('approved', 'submitted_for_evaluation', 'requires_changes',
    #                            'not_approved', name='status_enum'), nullable=False)

    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))