from config import app
from models.evaluation_windows import EvaluationWindow


def evaluate_current_window_projects():
    with app.app_context():
        window = EvaluationWindow.get_next_window()
        if window: 
            for project in window.project:
                latest_version_project = project.version_project[-1] #get latest version project, da fare meglio
                reports = latest_version_project.reports_project
                if reports: 
                    total = sum(report.vote for report in reports)
                    avg = total / len(reports)
                    print(avg)
                
                #TODO finire valutazione
                #crea nuova versione con approvato non approvato richiedente mod, vedi se abbiamo gia qualche metodo
                