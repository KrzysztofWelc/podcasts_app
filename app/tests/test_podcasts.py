import unittest
import json
from app.tests.base import BaseTestCase


class TestUserModel(BaseTestCase):
    def test_user_registration(self):
        title = 'test 1'
        description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        with self.client:
            response = self.client.post(
                '/podcasts/',
                data=json.dumps(dict(
                    title=title,
                    description=description
                )),
                headers=dict(
                    auth_token='Bearer '+self.token
                ),
                content_type='application/json'
            )
            self.assertEqual(response.status_code, 201)

            data = json.loads(response.data.decode())
            self.assertEqual(response.content_type, 'application/json')
            self.assertEqual(data.get('title'), title)
            self.assertEqual(data.get('description'), description)
            self.assertTrue(data.get('publish_date'))
            self.assertTrue(data.get('id'))
            self.assertEqual(data.get('author').get('email'), self.user.email)
            self.assertEqual(data.get('author').get('username'), self.user.username)
            self.assertEqual(data.get('author').get('profile_img'), 'default.jpg')
            self.assertTrue(data.get('author').get('id'))


if __name__ == '__main__':
    unittest.main()
