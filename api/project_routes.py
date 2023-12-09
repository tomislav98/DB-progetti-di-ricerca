from flask import Blueprint
from flask import request, Response, json
from models.users import User, UserType
from models.projects import Project, ProjectStatus
from models.project_versions import VersionProject
from models.reports import Report
from utils.exceptions import CustomError, error_handler
from utils.middleware import token_required, evaluator_required
import base64

proj_blueprint = Blueprint("proj", __name__)


# Se lo user è un ricercatore, restituisce, se il ricercatore e se stesso, tutte le versioni,
# se uno é un valutatore restituisce le versioni se un progetto é SUBMITTED
# (quindi è nell ultima finestra di valutazione) (tranne quelle in cui è TO_BE_SUBMITTED)
# TODO: testare
@proj_blueprint.route("/<int:project_id>/versions", methods=["GET"])
@token_required
@error_handler
def get_project_versions_by_id(current_user, project_id):
    if request.method == "GET":
        u = Project.get_user_from_project(project_id=project_id)

        project_versions = Project.get_project_versions_list(project_id)
        latest_version = project_versions[0]

        if (
            latest_version.status != ProjectStatus.SUBMITTED
            and current_user.type_user == UserType.EVALUATOR
        ):
            raise CustomError(
                "The project is either inexistent or not submitted yet", 404
            )

        if u.id != current_user.id:
            data = [
                {
                    "id": v.id,
                    "status": str(v.status),
                    "project_id": v.project_id,
                    "version": v.version,
                    "created": v.created,
                    "documents": [{"doc_id": doc.id} for doc in v.document_project],
                }
                for v in project_versions
                if v.status != ProjectStatus.TO_BE_SUBMITTED
            ]
        else:
            data = [
                {
                    "id": v.id,
                    "status": str(v.status),
                    "project_id": v.project_id,
                    "version": v.version,
                    "created": v.created,
                    "documents": [{"doc_id": doc.id} for doc in v.document_project],
                }
                for v in project_versions
            ]

        response_data = {
            "message": "Versions retrieved correctly!",
            "all_versions": data,
            "latest_version": latest_version.version,
        }

        return Response(json.dumps(response_data), 200)


# Create a report of the project's latest version
@proj_blueprint.route("/<int:project_id>/report", methods=["POST"])
@evaluator_required
@error_handler
def create_report(current_user, project_id):
    if request.method == "POST":
        body = request.form
        file = request.files
        vote = body.get("vote")
        if not vote or not file:
            raise CustomError("Vote and file are required", 400)
        project = Project.get_project_by_id(project_id)

        if project.status != ProjectStatus.SUBMITTED:
            raise CustomError("Cannot evaluate this project", 400)

        report = Report.create_new_report(project_id, current_user.id, file, vote)
        response_data = {"message": "Report Created Succesfully", "id": report.id}
        return Response(json.dumps(response_data), 201)


# Get all reports of a project's latest version
# Users allowed: Admin, Evaluators and the Researcher owner of the project
@proj_blueprint.route("/<int:project_id>/report", methods=["GET"])
@token_required
@error_handler
def get_reports_by_project_id(current_user, project_id):
    if request.method == "GET":
        latest = VersionProject.get_latest_version(project_id)
        reports = Report.get_reports_by_version_id(latest.id)
        project = Project.get_project_by_id(project_id)

        if (
            current_user.id == project.researcher_id
            or current_user.type_user == UserType.ADMIN
            or current_user.type_user == UserType.EVALUATOR
        ):
            return Response(
                json.dumps(
                    [
                        {
                            "id": x.id,
                            "created": x.date_created,
                            "pdf_data": base64.b64encode(x.pdf_data).decode("utf-8"),
                            "vote": x.vote,
                            "evaluator_email": User.get_user_by_id(x.evaluator_id).email,
                            "version_project_id": x.version_project_id,
                            "version": latest.version,
                            "project_name": project.name
                        }
                        for x in reports
                    ]
                )
            )
        raise CustomError("You are not allowed to retrieve this information", 401)

