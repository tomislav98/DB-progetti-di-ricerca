from functools import wraps
from utils.exceptions import CustomError, error_handler
from config import db
from sqlalchemy.exc import SQLAlchemyError


def commit():
    try:
        db.session.commit()
    except SQLAlchemyError as err: 
        print(err)         
        db.session.rollback()
        raise CustomError('Internal db error', 500)


def add_instance(instance):
    db.session.add(instance)
    commit()
    
def add_instance_no_commit(instance):
    db.session.add(instance)

def flush():
    db.session.flush()

