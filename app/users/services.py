from marshmallow import ValidationError
from app.users.models import User, BlackListedToken
from app import db


def get_user_by_id(user_id):
    u = User.query.filter_by(id=user_id).first()
    return u


def register_user(data):
    data.pop('password2')
    user = User(**data)
    db.session.add(user)
    db.session.commit()
    token = user.generate_auth_token()

    return token, user


def login_user(data):
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        return user.generate_auth_token(), user
    else:
        raise ValidationError({'general': ['wrong email of password']})


def logout_user(token):
    blt = BlackListedToken(token)
    db.session.add(blt)
    db.session.commit()
