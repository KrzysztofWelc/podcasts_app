from flask_testing import TestCase
# from flask import current_app
from app import db, create_app


class BaseTestCase(TestCase):
    def create_app(self):
        app = create_app('app.config.TestingConfig')
        return app

    def setUp(self):
        db.create_all()
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
