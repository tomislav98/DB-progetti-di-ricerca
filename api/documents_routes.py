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

documents_blueprint = Blueprint("documents", __name__)

# TODO: aggiungere sicurezza a questo endpoint, per adesso chiunque puo prendere i documenti di chiunque semplicemente selezionando a caso un numero
@documents_blueprint.route('/<int:document_id>', methods=['GET'])
@token_required
@error_handler
def download_document(current_user, document_id):
    doc = DocumentProject.query.filter_by(id=document_id).first()
    if doc is not None:
        temp_file_path = 'temp_document.pdf'
        with open(temp_file_path, 'wb') as temp_file:
            temp_file.write(doc.pdf_data)
        
        # Restituisci il file come risposta HTTP
        return send_file(
            temp_file_path,
            as_attachment=True,
            download_name= doc.name
        )