# Definizione della classe CustomError (se l'hai già definita altrove)
class CustomError(Exception):
    def __init__(self, message, status_code):
        super().__init__()
        self.message = message
        self.status_code = status_code

def error_handler(f):
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except CustomError as err:
            print(err.message)
            raise err
        except Exception as err:
            print(err)
            raise CustomError("Internal server error", 500)
    return decorated_function