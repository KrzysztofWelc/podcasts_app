from marshmallow import ValidationError
from app.users.models import User
from app import db


def register_user(data):
    data.pop('password2')
    user = User(**data)
    db.session.add(user)
    db.session.commit()

    return user


def login_user(data):
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        return user.generate_auth_token(), user
    else:
        raise ValidationError({'general': 'wrong email of passowrd'})