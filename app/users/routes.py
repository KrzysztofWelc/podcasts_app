from flask import Blueprint, request, make_response
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from app.users.schemas import RegisterSchema, UserSchema, LoginSchema
from app.users.services import register_user, login_user, logout_user
from app.users.decorators import login_required

users = Blueprint('users', __name__)


@users.route('/register', methods=['POST'])
def register():
    try:
        data = RegisterSchema().load(request.json)
        print(data)
        jwt, user = register_user(data)
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
        return err.messages


@users.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user(request.token)
    return make_response(), 200
