import unittest
import json

from faker import Faker

from app import db
from app.models import User, BlackListedToken
from app.tests.base import BaseTestCase

faker = Faker()

class TestUserModel(BaseTestCase):

    def test_user_registration(self):
        email = 'test1@mail.com'
        password = 'Test1234'
        username = 'test1'
        with self.client:
            response = self.client.post(
                '/api/users/register',
                data=json.dumps(dict(
                    email=email,
                    password=password,
                    password2=password,
                    username=username
                )),
                content_type='application/json'
            )
            self.assertEqual(response.status_code, 201)
            data = json.loads(response.data.decode())
            self.assertEqual(response.content_type, 'application/json')
            self.assertTrue(data.get('token'))
            self.assertEqual(data.get('user').get('email'), email)
            self.assertEqual(data.get('user').get('username'), username)
            self.assertEqual(data.get('user').get('username'), username)
            self.assertEqual(data.get('user').get('profile_img'), 'default.jpg')

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
