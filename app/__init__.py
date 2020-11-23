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
    db.init_app(app)
    bcrypt.init_app(app)

    from app.users.routes import users
    app.register_blueprint(users, url_prefix='/users')

    return app
