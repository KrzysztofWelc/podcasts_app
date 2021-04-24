from functools import wraps
from flask import request, make_response
from app.users.models import User, BlackListedToken


def login_required(f):
    @wraps(f)
    def dec(*args, **kwargs):

        auth_header = request.headers.get('authToken', '')
        if auth_header:
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                return make_response({'message': 'invalid token format'}), 401
            user = User.verify_auth_token(token)
            token_check = BlackListedToken.query.filter_by(token=token).first()
            if user and not token_check:
                request.user = user
                request.token = token
            else:
                return make_response({'message': 'you are not authenticated'}), 401
        else:
            return make_response({'message': 'you are not authenticated'}), 401
        return f(*args, **kwargs)

    return dec


