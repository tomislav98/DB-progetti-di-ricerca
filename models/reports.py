from datetime import datetime
from config import db
from sqlalchemy import DateTime, CheckConstraint, UniqueConstraint
from .project_versions import VersionProject

class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    date_created = db.Column(DateTime, default=datetime.now(), nullable=False)
    pdf_data =  db.Column(db.LargeBinary, nullable=False)
    vote = db.Column(db.Integer, CheckConstraint('vote >= 0 AND vote <= 10'), nullable=False)
    evaluator_id = db.Column(db.Integer, db.ForeignKey('evaluators.id'))
    version_project_id = db.Column(db.Integer, db.ForeignKey('version_projects.id'))

    __table_args__ = (UniqueConstraint('evaluator_id', 'version_project_id'), )

    @classmethod
    def create_new_report(cls, project_id, evaluator_id, file, vote):
        latest_version = VersionProject.get_latest_version(project_id)
        files = []
        for key, value in file.items():
            files.append(value)
            print(files)
        report = cls(version_project_id = latest_version.id, evaluator_id = evaluator_id, pdf_data = files[0].read(), vote = vote)
        db.session.add(report)
        db.session.commit()
        return report
        
