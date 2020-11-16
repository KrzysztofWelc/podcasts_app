import pprint
from app.users.models import User
from app import db

pp = pprint.PrettyPrinter(indent=4)


def register_user(data):
    data.pop('password2')
    user = User(**data)
    db.session.add(user)
    db.session.commit()

    return user