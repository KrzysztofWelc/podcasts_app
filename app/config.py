import os
from dotenv import load_dotenv

load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))


class BaseConfig:
    SECRET_KEY = os.getenv('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL')
    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND')
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    FLASK_MODELS_MODULE = 'app.models'  # where all of your model classes are imported
    PY_YAML_FIXTURES_DIR = 'app/fixtures'  # where your fixtures file(s) live
    PY_YAML_FIXTURES_COMMAND_NAME = 'import-fixtures'  # the name of the CLI command


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
