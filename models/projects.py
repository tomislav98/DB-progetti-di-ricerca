from config import db

class Project(db.Model):
    __tablename__ = 'projects'
    # name='status_enum'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    data_creation = db.Column(db.Date, nullable=False)
    # status = db.Column(db.Enum('approved', 'submitted_for_evaluation', 'requires_changes',
    #                            'not_approved', name='status_enum'), nullable=False)
    # the 'researchers.id' that I created need to be just interpreted for developer.
    researcher_id = db.Column(db.Integer, db.ForeignKey('researchers.id'), nullable=False)
    evaluation_window_id = db.Column(db.Integer, db.ForeignKey('evaluation_windows.id'))
    assessment_reports = db.relationship('AssessmentReport', backref='project')
    document_project = db.relationship('DocumentProject', backref='project')
    version_project = db.relationship('VersionProject', backref='project')
    message = db.relationship('Message', backref='project')

    @classmethod
    def add_project(cls, name, description, data_creation):
        project = cls(name=name, description=description, data_creation=data_creation)
        db.session.add(project)
        db.session.commit()
    
