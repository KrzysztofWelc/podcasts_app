import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv

load_dotenv()

db = SQLAlchemy()
bcrypt = Bcrypt()


def create_app(config=None):
    app = Flask(__name__)

    if not config:
        app_settings = os.getenv(
            'APP_SETTINGS',
            'app.config.DevelopmentConfig'
        )
    else:
        app_settings = config

    app.config.from_object(app_settings)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    db.init_app(app)
    bcrypt.init_app(app)

    from app.users.routes import users
    from app.podcasts.routes import podcasts
    app.register_blueprint(users, url_prefix='/users')
    app.register_blueprint(podcasts, url_prefix='/podcasts')

    return app
