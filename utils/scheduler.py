from config import app, db
from models.evaluation_windows import EvaluationWindow
from models.project_documents import DocumentProject
from models.project_versions import VersionProject
from models.projects import ProjectStatus
from utils.db_utils import commit
from utils.exceptions import error_handler 
from utils.versions import get_incremented_version

@error_handler
def evaluate_current_window_projects():
    with app.app_context():
        window = EvaluationWindow.get_next_window()
        if window: 
            for project in window.project:
                latest_version_project = VersionProject.get_latest_version(project.id) #get latest version project, da fare meglio
                reports = latest_version_project.reports_project
            
                evaluated_status = ProjectStatus.REQUIRES_CHANGES
                if reports: 
                    total = sum(report.vote for report in reports)
                    avg_vote = total / len(reports)
                    if avg_vote >= 7: 
                        evaluated_status = ProjectStatus.APPROVED
                    if avg_vote <= 3: 
                        evaluated_status = ProjectStatus.NOT_APPROVED
                        
                new_version = get_incremented_version(project.latest_version)
                
                #Crea versione e copia documenti
                v = VersionProject.create_version(status  = evaluated_status , project_id = project.id, version = new_version)
                for file in latest_version_project.document_project:
                    DocumentProject.create_document(file.name, file.type_document, v.id, file.pdf_data)
                print(f'Created Evaluation for project_id: {project.id}, version_id: {v.id}, status:{evaluated_status}')
                #TODO vedere bene il comportamento(dovrebber fungere ma puzza qualcosa)
                project.latest_version = new_version
                project.status = evaluated_status
                commit()
             

                
                
                