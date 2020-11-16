from flask import Blueprint, request
from marshmallow import ValidationError
from app.users.schemas import RegisterSchema, UserSchema, LoginSchema
from app.users.services import register_user, login_user

users = Blueprint('users', __name__)


@users.route('/register', methods=['POST'])
def register():
    try:
        data = RegisterSchema().load(request.json)
        user = register_user(data)
        res = UserSchema().dump(user)
        return res
    except ValidationError as err:
        return err.messages


@users.route('/login', methods=['POST'])
def login():
    try:
        data = LoginSchema().load(request.json)
        jwt, user = login_user(data)
        return {'token': jwt, 'user': UserSchema().dump(user)}
    except ValidationError as err:
        return err.messages
