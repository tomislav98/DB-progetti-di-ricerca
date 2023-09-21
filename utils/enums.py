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

