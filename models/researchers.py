from config import db

class Researcher(db.Model):
    __tablename__ = 'researchers'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False) # sistemare ondelete='CASCADE',
    # backref='researcher' add researcher attribute to Project model,
    # in that way I can use this attribute on any instance of Project
    # that create a list of projects that have one researcher
    projects = db.relationship('Project', backref='researcher')
    message = db.relationship('Message', backref='researcher')

    # esiste anche quello personalizzato
    # def __init__(self, name='', surname='', email='', password=''):
    #     self.name = name
    #     self.surname = surname
    #     self.email = email
    #     self.password_hash = password

    @classmethod
    def add_researcher(cls, user_id):
        researcher = Researcher(user_id=user_id)
        db.session.add(researcher)
        db.session.commit()

    # @classmethod
    # def update_researcher(cls, researcher, attribute_name, new_value):
    #     # Python function that accept object, attribute for change and new_value
    #     setattr(researcher, attribute_name, new_value)
    #     db.session.commit()
    #  password from user passed on login