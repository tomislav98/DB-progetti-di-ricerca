from flask import Blueprint, send_file
from flask import  jsonify, make_response
from models.project_documents import DocumentProject
from utils.exceptions import error_handler
from utils.middleware import token_required
import io
import fitz
import base64

documents_blueprint = Blueprint("documents", __name__)

@documents_blueprint.route("/<int:document_id>", methods=["GET"])
@token_required
@error_handler
def get_document(current_user, document_id):
    doc = DocumentProject.query.filter_by(id=document_id).first()

    if doc is not None:
        # Extract metadata and image preview from the PDF
        pdf_buffer = io.BytesIO(doc.pdf_data)
        pdf_document = fitz.open(stream=pdf_buffer, filetype="pdf")

        metadata = {
            "name": doc.name,
            "type_document": doc.type_document,
            "version_project_id": doc.version_project_id,
            "created": doc.created,
            "page_count": pdf_document.page_count,
        }

        # Get the first page as an image for preview
        image_bytes = pdf_document[0].get_pixmap().tobytes("png")
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        # Create a response with JSON data and image
        response_data = {
            "metadata": metadata,
            "image_preview": image_base64,
            "pdf_data": base64.b64encode(doc.pdf_data).decode("utf-8"),
            "id": document_id
        }

        # Return the response
        response = make_response(jsonify(response_data))
        response.headers["Content-Type"] = "application/json"
        return response


@documents_blueprint.route("/downloads/<int:document_id>", methods=["GET"])
@token_required
@error_handler
def download_document(current_user, document_id):
    doc = DocumentProject.query.filter_by(id=document_id).first()
    if doc is not None:
        return send_file(
            io.BytesIO(doc.pdf_data),
            as_attachment=True,
            download_name=doc.name,
            mimetype="application/pdf",
        )
