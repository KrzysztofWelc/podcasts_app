import os, secrets
from flask import current_app as app
from marshmallow import ValidationError
from app.users.models import User, BlackListedToken
from app import db
from app.exceptions import OperationNotPermitted


def get_user_by_id(user_id):
    u = User.query.filter_by(id=user_id).first()
    return u


def register_user(data, avatar=None):
    data.pop('password2')
    user = User(**data)
    if avatar:
        a = save_avatar(avatar)
        user.profile_img = a
    db.session.add(user)
    db.session.commit()
    token = user.generate_auth_token()

    return token, user


def save_avatar(file):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(file.filename)
    new_filename = random_hex + f_ext
    file_path = os.path.join(app.root_path, 'static/avatars', new_filename)

    file.save(file_path)

    return new_filename


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


def change_password(user, new_pwd, old_pwd):
    if user.check_password(old_pwd):
        user.password = new_pwd
    else:
        raise OperationNotPermitted('wrong old password')
