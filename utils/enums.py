from enum import Enum

class ProjectStatus(Enum):
    APPROVED = 0
    SUBMITTED = 1
    REQUIRES_CHANGES = 2
    NOT_APPROVED = 3
    TO_BE_SUBMITTED = 4

    @staticmethod
    def get_enum_by_int(type_user):
        match type_user:
            case 0:
                return ProjectStatus.APPROVED
            case 1:
                return ProjectStatus.SUBMITTED
            case 2:
                return ProjectStatus.REQUIRES_CHANGES
            case 3:
                return ProjectStatus.NOT_APPROVED
            case 4:
                return ProjectStatus.TO_BE_SUBMITTED
            case _:
                print("Errore")

class DocumentType(Enum):
    DATA_MANAGEMENT_PLAN = 0
    ETHICS_DELIVERABLE = 1
    SCIENTIFIC_REPORT = 2
    FINANCIAL_BUDGET = 3
    COMMUNICATION_DISSEMINATION_PLAN = 4
    RISK_ANALYSIS = 5
    LETTERS_OF_SUPPORT_COLLABORATION = 6
    ETHICS_PLAN = 7
    CV_PRINCIPAL_INVESTIGATORS = 8
    LEGAL_DOCUMENTS = 9
    PROGRESS_REPORTS = 10
    UNDEFINED = 11
    
    @staticmethod
    def get_enum(type):
        match type.lower():
            case 0, 'dmp', 'data_management_plan':
                return DocumentType.DATA_MANAGEMENT_PLAN
            case 1, 'ed', 'ethics':
                return DocumentType.ETHICS_DELIVERABLE
            case 2, 'sr', 'scientific_report':
                return DocumentType.SCIENTIFIC_REPORT
            case 3, 'fb', 'financial_budget':
                return DocumentType.FINANCIAL_BUDGET
            case 4, 'cdp', 'communication_dissemination_plan':
                return DocumentType.COMMUNICATION_DISSEMINATION_PLAN
            case 5, 'ra', 'risk_analysis':
                return DocumentType.RISK_ANALYSIS
            case 6, 'losc', 'letters_of_support_collaboration':
                return DocumentType.LETTERS_OF_SUPPORT_COLLABORATION
            case 7, 'ep', 'ethics_plan':
                return DocumentType.ETHICS_PLAN
            case 8, 'cv', 'cv_principal_investigators':
                return DocumentType.CV_PRINCIPAL_INVESTIGATORS
            case 9, 'ld', 'legal_documents':
                return DocumentType.LEGAL_DOCUMENTS
            case 10, 'pr', 'progress_reports':
                return DocumentType.PROGRESS_REPORTS
            case 11, 'undef', 'undefined':
                return DocumentType.UNDEFINED
            case _:
                raise ValueError("Invalid document type")