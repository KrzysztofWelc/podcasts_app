import os
import app.env as conf

basedir = os.path.abspath(os.path.dirname(__file__))


class BaseConfig:
    SECRET_KEY = conf.SECRET_KEY
    SQLALCHEMY_DATABASE_URI = conf.SQLALCHEMY_DATABASE_URI


class TestingConfig(BaseConfig):
    DEBUG = True
    TESTING = True
    BCRYPT_LOG_ROUNDS = 4
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test.db'
    PRESERVE_CONTEXT_ON_EXCEPTION = False


class DevelopmentConfig(BaseConfig):
    DEBUG = True


class ProductionConfig(BaseConfig):
    DEBUG = False
