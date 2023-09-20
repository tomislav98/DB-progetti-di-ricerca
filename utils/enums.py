from enum import Enum

class ProjectStatus(Enum):
    APPROVED = 0
    SUBMITTED = 1
    REQUIRES_CHANGES = 2
    NOT_APPROVED = 3
    TO_BE_SUBMITTED = 4
