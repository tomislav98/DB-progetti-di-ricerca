from config import app
from models.evaluation_windows import EvaluationWindow
from models.projects import ProjectStatus


def evaluate_current_window_projects():
    with app.app_context():
        window = EvaluationWindow.get_next_window()
        if window: 
            for project in window.project:
                latest_version_project = project.version_project[0] #get latest version project, da fare meglio
                reports = latest_version_project.reports_project
                documents = latest_version_project.document_project
                    
                vote = ProjectStatus.REQUIRES_CHANGES
                if reports: 
                    total = sum(report.vote for report in reports)
                    avg = total / len(reports)
                    if avg >= 7: 
                        vote = ProjectStatus.APPROVED
                    if avg <= 3: 
                        vote = ProjectStatus.NOT_APPROVED
                
                
                #TODO finire valutazione
                #crea nuova versione con approvato non approvato richiedente mod, vedi se abbiamo gia qualche metodo
                