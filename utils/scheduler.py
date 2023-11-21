from config import app, db
from models.evaluation_windows import EvaluationWindow
from models.project_documents import DocumentProject
from models.project_versions import VersionProject
from models.projects import ProjectStatus
from utils.exceptions import error_handler 


@error_handler
def evaluate_current_window_projects():
    with app.app_context():
        window = EvaluationWindow.get_next_window()
        if window: 
            for project in window.project:
                latest_version_project = project.version_project[-1] #get latest version project, da fare meglio
                reports = latest_version_project.reports_project
                documents = latest_version_project.document_project
                # print(project.id)
                # print(latest_version_project)
                # print(reports)

                evaluated_status = ProjectStatus.REQUIRES_CHANGES
                if reports: 
                    total = sum(report.vote for report in reports)
                    avg_vote = total / len(reports)
                    if avg_vote >= 7: 
                        evaluated_status = ProjectStatus.APPROVED
                    if avg_vote <= 3: 
                        evaluated_status = ProjectStatus.NOT_APPROVED
                #Autoincrement version TODO metterlo in uno utils ed utilizzarlo dove lo usiamo
                major, minor, patch = map(int, project.latest_version[1:].split('.'))
                patch += 1
                new_version = f'v{major}.{minor}.{patch}'
                

                #Crea versione e copia documenti
                v = VersionProject.create_version(status  = evaluated_status , project_id = project.id, version = new_version)
                for file in latest_version_project.document_project:
                    DocumentProject.create_document(file.name, file.type_document, v.id, file.pdf_data)
                print(f'Created Evaluation for project_id: {project.id}, version_id: {v.id}, status:{evaluated_status}')
                #TODO vedere bene il comportamento(dovrebber fungere ma puzza qualcosa)
                project.latest_version = new_version
                project.status = evaluated_status
                db.session.commit()
             

                
                
                