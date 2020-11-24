from flask_testing import TestCase
from app import db, create_app
from app.models import User


class BaseTestCase(TestCase):
    def create_app(self):
        app = create_app('app.config.TestingConfig')
        return app

    def setUp(self):
        db.create_all()
        u = User(email='testuser@mail.com', username='testuser', password='Test123%')
        db.session.add(u)
        db.session.commit()
        self.user = u
        self.token = u.generate_auth_token()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
