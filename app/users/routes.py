from flask import Blueprint, request
from marshmallow import ValidationError
from app.users.schemas import RegisterSchema, UserSchema
from app.users.services import register_user

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
