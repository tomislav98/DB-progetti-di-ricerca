from models.users import User, UserType


def populate_users(session): 
    
    User.add_user(name='mimmo1', 
             surname='mimmo', 
             email='mimmo1@mimmo.it', 
             password='mimmo',
             type_user=UserType.EVALUATOR.value ) 
    User.add_user(name='mimmo1', 
             surname='mimmo', 
             email='mimmo2@mimmo.it', 
             password='mimmo',
             type_user=UserType.RESEARCHER.value )
    admin = User(name='mimmomamo', 
             surname='mimmo', 
             email='mimmo@mimmo.it', 
             password='$2b$12$6ib7M2USoVi7pobLmSTnIOp8NZNRoZSETM7W8JMOOuTrWMnl1qbx2', 
             type_user=UserType.ADMIN)
    session.add(admin)
    session.commit()