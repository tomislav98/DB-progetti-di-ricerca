from flask import Blueprint, send_file
from config import bcrypt
from flask import request, jsonify, Response, json
from models.users import User, Evaluator, Researcher, UserType
from models.projects import Project
from models.evaluation_windows import EvaluationWindow
from models.project_documents import DocumentProject
from utils.exceptions import CustomError, error_handler
from datetime import datetime, timedelta
import jwt
import os
from utils.middleware import token_required
import io

documents_blueprint = Blueprint("documents", __name__)

# TODO: aggiungere sicurezza a questo endpoint, per adesso chiunque puo prendere i documenti di chiunque semplicemente selezionando a caso un numero
# TODO: verificare che sta roba del temp_document.pdf sia giusta mi sembra un po sus che ci sia bisogno di salvare un file temporaneo

@documents_blueprint.route('/<int:document_id>', methods=['GET'])
@token_required
@error_handler
def download_document(current_user, document_id):
    doc = DocumentProject.query.filter_by(id=document_id).first()
    if doc is not None:
        return send_file(
            io.BytesIO(doc.pdf_data),
            as_attachment=True,
            download_name=doc.name,
            mimetype='application/pdf'
        )