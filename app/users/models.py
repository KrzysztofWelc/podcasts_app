from datetime import datetime
from flask import current_app
from itsdangerous import JSONWebSignatureSerializer as JWSSerializer
from app import db, bcrypt, constants


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    bio = db.Column(db.String(500), default='')
    profile_img = db.Column(db.String(35), nullable=False, default='default.jpg')
    password = db.Column(db.String(60), nullable=False)
    join_date = db.Column(db.DateTime, nullable=False, default=datetime.now)
    podcasts = db.relationship('Podcast', backref='author', lazy=True)
    comments = db.relationship('Comment', backref='author', lazy=True)
    answers = db.relationship('AnswerComment', backref='author', lazy=True)

    def __init__(self, email, username, password):
        self.email = email
        self.username = username
        self.password = bcrypt.generate_password_hash(
            password,
            current_app.config.get('BCRYPT_LOG_ROUNDS')
        ).decode()

    def __repr__(self):
        return 'user {} {} {}'.format(self.username, self.email, self.id)

    def check_password(self, plain_password):
        return bcrypt.check_password_hash(self.password, plain_password)

    def set_new_pwd(self, plain_pwd):
        self.password = bcrypt.generate_password_hash(
            plain_pwd,
            current_app.config.get('BCRYPT_LOG_ROUNDS')
        ).decode()

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
