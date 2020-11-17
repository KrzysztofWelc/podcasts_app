from functools import wraps
from flask import request, make_response
from app.users.models import User


def login_required(f):
    @wraps(f)
    def dec(*args, **kwargs):

        auth_header = request.headers.get('auth_token', '')
        if auth_header:
            token = auth_header.split(' ')[1]
            user = User.verify_auth_token(token)
            if user:
                request.user = user
                request.token = token
            else:
                return make_response({'message': 'you are not authenticated2'}), 401
        else:
            return make_response({'message': 'you are not authenticated'}), 401
        return f(*args, **kwargs)

    return dec
