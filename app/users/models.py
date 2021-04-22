from datetime import datetime
from flask import current_app
from sqlalchemy.ext.hybrid import hybrid_property
from itsdangerous import JSONWebSignatureSerializer as JWSSerializer
from app import db, bcrypt, constants


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    profile_img = db.Column(db.String(20), nullable=False, default='default.jpg')
    _password = db.Column(db.String(60), nullable=False)
    join_date = db.Column(db.DateTime, nullable=False, default=datetime.now)
    podcasts = db.relationship('Podcast', backref='author', lazy=True)
    comments = db.relationship('Comment', backref='author', lazy=True)

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, plain_password):
        self._password = bcrypt.generate_password_hash(
            plain_password,
            current_app.config.get('BCRYPT_LOG_ROUNDS')
        ).decode()

    def __repr__(self):
        return 'user {} {} {}'.format(self.username, self.email, self.id)

    def check_password(self, plain_password):
        return bcrypt.check_password_hash(self.password, plain_password)

    def generate_auth_token(self):
        s = JWSSerializer(current_app.config.get('SECRET_KEY'))
        payload = {'user_id': self.id,
                   'type': constants.AUTH_TOKEN,
                   'gen_time': datetime.now().strftime("%m/%d/%Y, %H:%M:%S")}
        token = s.dumps(payload).decode()

        return token

    @staticmethod
    def verify_auth_token(token):
        s = JWSSerializer(current_app.config.get('SECRET_KEY'))
        try:
            data = s.loads(token)
            user_id = data['user_id']
            if data['type'] != constants.AUTH_TOKEN:
                raise ValueError('Invalid token type')
        except:
            return None

        return User.query.get(user_id)


class BlackListedToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(500), nullable=False)
    blacklisted_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    def __init__(self, token):
        self.token = token

    def __repr__(self):
        return self.token
