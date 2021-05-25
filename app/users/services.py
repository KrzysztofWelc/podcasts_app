import os, secrets
from flask import current_app as app
from marshmallow import ValidationError
from PIL import Image

from app.translations.utils import t
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
    i = Image.open(file)
    i.thumbnail((200, 200))
    i.save(file_path)

    return new_filename


def login_user(data):
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        return user.generate_auth_token(), user
    else:
        raise ValidationError({'general': [t('email_or_pass_error')]})


def logout_user(token):
    blt = BlackListedToken(token)
    db.session.add(blt)
    db.session.commit()


def change_password(user, new_pwd, old_pwd):
    if user.check_password(old_pwd):
        user.set_new_pwd(new_pwd)
        db.session.commit()
    else:
        raise OperationNotPermitted('wrong old password')


def change_profile_img(user, img):
    old_avatar = user.profile_img
    new_avatar_name = save_avatar(img)
    user.profile_img = new_avatar_name
    db.session.commit()
    if old_avatar != 'default.jpg':
        os.remove(os.path.join(app.root_path, 'static/avatars', old_avatar))


def change_users_bio(user, bio):
    user.bio = bio
    db.session.commit()
