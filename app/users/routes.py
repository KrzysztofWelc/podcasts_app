import os
from flask import Blueprint, request, make_response, send_from_directory, current_app as app
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from app.users.schemas import RegisterSchema, UserSchema, LoginSchema, ChangePwdSchema, ChangeBioSchema
from app.users.services import register_user, login_user, logout_user, get_user_by_id, change_password, \
    change_profile_img, change_users_bio
from app.users.decorators import login_required
from app.exceptions import OperationNotPermitted
from app.translations.utils import t

users = Blueprint('users', __name__)


@users.route('/register', methods=['POST'])
def register():
    try:
        data = RegisterSchema().load(request.form)
        avatar = request.files.get('profile_img')
        if avatar and not os.path.splitext(avatar.filename)[1] in ['.jpg', '.jpeg', '.png']:
            raise ValidationError({'profile_img': [t('img_format_error')]})
        jwt, user = register_user(data, avatar)
        return make_response({'token': jwt, 'user': UserSchema().dump(user)}), 201
    except ValidationError as err:
        return make_response(err.messages), 400
    except SQLAlchemyError as err:
        e = str(err)
        print(e)
        return make_response(e), 500


@users.route('/login', methods=['POST'])
def login():
    try:
        data = LoginSchema().load(request.json)
        jwt, user = login_user(data)
        return {'token': jwt, 'user': UserSchema().dump(user)}
    except ValidationError as err:
        return make_response(err.messages), 400
    except SQLAlchemyError as err:
        e = str(err)
        print(e)
        return make_response(e), 500


@users.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user(request.token)
    return make_response(), 200


@users.route('/<user_id>/data', methods=['GET'])
def get_user_data(user_id):
    try:
        user = get_user_by_id(user_id)
        res = UserSchema().dump(user)
        return res
    except ValidationError as err:
        return make_response(err.messages), 400
    except SQLAlchemyError as err:
        e = str(err)
        print(e)
        return make_response(e), 500


@users.route('/avatar/<filename>')
def get_podcast_image(filename):
    avatars_dir = os.path.abspath(os.path.join(app.root_path, 'static/avatars'))
    return send_from_directory(avatars_dir, filename)


@users.route('/change_pwd', methods=['PATCH'])
@login_required
def change_pwd():
    try:
        data = ChangePwdSchema().dump(request.json)
        change_password(request.user, data['new_pwd'], data['old_pwd'])
        return make_response()
    except ValidationError as err:
        return make_response(err.messages), 400
    except OperationNotPermitted as err:
        return make_response({'error': err.message}), 400
    except SQLAlchemyError as err:
        e = str(err)
        print(e)
        return make_response(e), 500


@users.route('/change_profile_pic', methods=['PATCH'])
@login_required
def change_avatar():
    try:
        new_img = request.files.get('new_profile_pic')
        if not new_img:
            raise OperationNotPermitted(t('no_img_error'))
        _, ext = os.path.splitext(new_img.filename)
        if ext not in ['.jpg', '.jpeg', '.png']:
            raise OperationNotPermitted(t('img_format_error'))

        change_profile_img(request.user, new_img)

        return make_response()
    except ValidationError as err:
        return make_response(err.messages), 400
    except OperationNotPermitted as err:
        return make_response({'error': err.message}), 400
    except SQLAlchemyError as err:
        e = str(err)
        print(e)
        return make_response(e), 500


@users.route('/edit_bio', methods=['PATCH'])
@login_required
def change_bio():
    try:
        bio = ChangeBioSchema().dump(request.json)['bio']
        change_users_bio(request.user, bio)
        return make_response({'bio': bio}), 200
    except ValidationError as err:
        return make_response(err.messages), 400
    except OperationNotPermitted as err:
        return make_response({'error': err.message}), 400
    except SQLAlchemyError as err:
        e = str(err)
        print(e)
        return make_response(e), 500