from secrets import token_hex
from flask_testing import TestCase
from app import db, create_app
from app.models import User


# TODO: improve tests package's structure

class BaseTestCase(TestCase):
    def create_app(self):
        app = create_app('app.config.TestingConfig')
        return app

    def setUp(self):
        db.create_all()
        ip = token_hex(8)
        self.plain_pwd = 'Test123'
        u = User(email='martin{}@mail.com'.format(ip), username='testuser{}'.format(ip), password=self.plain_pwd)
        db.session.add(u)
        db.session.commit()
        self.user = u
        self.token = u.generate_auth_token()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
