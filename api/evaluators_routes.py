from flask import Blueprint
from flask import Response, json
from models.project_versions import VersionProject
from models.reports import Report
from models.evaluation_windows import EvaluationWindow
from utils.exceptions import CustomError, error_handler
from utils.middleware import evaluator_required
import base64

evaluators_blueprint = Blueprint("evaluators", __name__)

# retrieves project to value, the only accessible by evaluators
#  faccio project.version_project[-1] che apparentemente va
@evaluators_blueprint.route("/projects", methods=["GET"])
@evaluator_required
@error_handler
def get_projects_to_value(current_user):
    evaluation_window = EvaluationWindow.get_next_window()
    if not evaluation_window:
        raise CustomError("The evaluation winodow hasn't started yet", 404)
    if not evaluation_window.project:
         raise CustomError("There are no projects submitted yet", 404)

    project_data = [
        {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "status": str(project.status),
            "researcher": project.researcher_id,
            "latest_version": {
                "version": project.get_latest_version().version,
                "documents": [
                    {
                        "name": x.name,
                        "id": x.id,
                        "type": x.type_document,
                        "created": x.created,
                        "data": base64.b64encode(x.pdf_data).decode("utf-8"),
                    }
                    for x in project.get_latest_version().document_project
                ],
            },
        }
        for project in evaluation_window.project
    ]
    return Response(json.dumps(project_data), 200)

# retrieves evaluator's own reports
@evaluators_blueprint.route("/reports", methods=["GET"])
@evaluator_required
@error_handler
def get_evaluator_reports(current_user):
    reports = Report.get_reports_by_evaluator_id(current_user.id)


    reports_data = [
        {
            "id": report.id,
            "vote": report.vote,
            "pdf_data": base64.b64encode(report.pdf_data).decode("utf-8"),
            "created": str(report.date_created),
            "project_id": VersionProject.get_version_by_id(report.version_project_id).project_id
        }
        for report in reports
    ]

    return Response(json.dumps(reports_data), 200)
