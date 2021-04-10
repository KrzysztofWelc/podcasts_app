import unittest
import json
import io

from faker import Faker

from app import db
from app.models import User, BlackListedToken
from app.tests.base import BaseTestCase
from app.tests.utils import delete_dummy_avatars

faker = Faker()


class TestUserModel(BaseTestCase):
    def tearDown(self):
        super(TestUserModel, self).tearDown()
        delete_dummy_avatars(['default.jpg'])

    def generate_dummy_avater_file(self):
        bytes_header = b"\xff\xfb\xd6\x04"
        filler = b"\x01" * 800
        file = (io.BytesIO(bytes_header + filler), 'test.jpg')
        return file

    def test_user_registration(self):
        email = 'test1@mail.com'
        password = 'Test1234'
        username = 'test1'
        data = dict(
            email=email,
            password=password,
            password2=password,
            username=username
        )
        data = {key: str(value) for key, value in data.items()}
        with self.client:
            response = self.client.post(
                '/api/users/register',
                data=data,
                content_type='multipart/form-data'
            )
            self.assertEqual(response.status_code, 201)
            data = json.loads(response.data.decode())
            self.assertEqual(response.content_type, 'application/json')
            self.assertTrue(data.get('token'))
            self.assertEqual(data.get('user').get('email'), email)
            self.assertEqual(data.get('user').get('username'), username)
            self.assertEqual(data.get('user').get('username'), username)
            self.assertEqual(data.get('user').get('profile_img'), 'default.jpg')

    def test_user_registration_with_avatar(self):
        email = 'test1@mail.com'
        password = 'Test1234'
        username = 'test1'
        with self.client:
            data = dict(
                email=email,
                password=password,
                password2=password,
                username=username
            )
            data = {key: str(value) for key, value in data.items()}
            data['profile_img'] = self.generate_dummy_avater_file()
            response = self.client.post(
                '/api/users/register',
                data=data,
                content_type='multipart/form-data'
            )
            self.assertEqual(response.status_code, 201)
            data = json.loads(response.data.decode())
            self.assertEqual(response.content_type, 'application/json')
            self.assertTrue(data.get('token'))
            self.assertEqual(data.get('user').get('email'), email)
            self.assertEqual(data.get('user').get('username'), username)
            self.assertEqual(data.get('user').get('username'), username)
            self.assertNotEqual(data.get('user').get('profile_img'), 'default.jpg')


def test_user_login(self):
    email = 'test2@mail.com'
    password = 'Test1234'
    username = 'test1'

    user = User(email=email, password=password, username=username)
    db.session.add(user)
    db.session.commit()

    with self.client:
        response = self.client.post(
            '/api/users/login',
            data=json.dumps(dict(
                email=email,
                password=password)),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data.decode())
        self.assertEqual(response.content_type, 'application/json')
        self.assertTrue(data.get('token'))
        self.assertEqual(data.get('user').get('email'), email)
        self.assertEqual(data.get('user').get('username'), username)
        self.assertEqual(data.get('user').get('username'), username)
        self.assertEqual(data.get('user').get('profile_img'), 'default.jpg')


def test_user_logout(self):
    email = 'test3@mail.com'
    password = 'Test1234'
    username = 'test1'

    user = User(email=email, password=password, username=username)
    db.session.add(user)
    db.session.commit()
    token = user.generate_auth_token()

    with self.client:
        response = self.client.post(
            '/api/users/logout',
            headers=dict(
                auth_token='Bearer ' + token
            ),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)

        token_check = BlackListedToken.query.filter_by(token=token).first()
        self.assertTrue(token_check)


def test_get_user_data(self):
    with self.client:
        res = self.client.get('/api/users/{}/data'.format(self.user.id))

        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data.decode())

        self.assertEqual(data['email'], self.user.email)
        self.assertEqual(data['username'], self.user.username)
        self.assertEqual(data['profile_img'], self.user.profile_img)
        self.assertEqual(int(data['id']), int(self.user.id))


if __name__ == '__main__':
    unittest.main()
