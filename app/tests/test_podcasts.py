import unittest
import json
import io

from app import db
from app.models import User, Podcast
from app.tests.base import BaseTestCase
from app.tests.utils import get_real_podcasts, delete_dummy_podcasts


class TestPodcastsPackage(BaseTestCase):
    def setUp(self):
        super(TestPodcastsPackage, self).setUp()
        email = 'test1@mail.com'
        password = 'Test1234'
        username = 'test1'

        user = User(email=email, password=password, username=username)
        db.session.add(user)
        db.session.commit()
        self.user = user

        self.real_podcasts = get_real_podcasts()

    def tearDown(self):
        super(TestPodcastsPackage, self).tearDown()
        delete_dummy_podcasts(self.real_podcasts)

    def generate_dummy_podcast_file(self):
        bytes_header = b"\xff\xfb\xd6\x04"
        filler = b"\x01" * 800
        file = (io.BytesIO(bytes_header + filler), 'test.mp3')
        return file

    def test_podcast_add(self):
        with self.client:
            data = dict(
                title='title1',
                description="lorem ipsum dolor sit",
            )
            data = {key: str(value) for key, value in data.items()}
            data['audio_file'] = self.generate_dummy_podcast_file()
            response = self.client.post(
                '/podcasts',
                data=data,
                content_type='multipart/form-data',
                headers=dict(
                    auth_token='Bearer ' + self.user.generate_auth_token()
                ),
            )
            self.assertEqual(response.status_code, 201)
            data = json.loads(response.data.decode())
            self.assertEqual(response.content_type, 'application/json')
            self.assertIn('.mp3', data.get('audio_file'))
            self.assertEqual(data.get('author').get('id'), str(self.user.id))

    def test_get_podcast(self):
        with self.client:
            data = dict(
                title='title1',
                description="lorem ipsum dolor sit",
            )
            data = {key: str(value) for key, value in data.items()}
            data['audio_file'] = self.generate_dummy_podcast_file()
            response = self.client.post(
                '/podcasts',
                data=data,
                content_type='multipart/form-data',
                headers=dict(
                    auth_token='Bearer ' + self.user.generate_auth_token()
                ),
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 201)

            get_res = self.client.get('/podcasts/' + str(data['id']))
            get_data = json.loads(get_res.data.decode())
            self.assertEqual(get_res.status_code, 200)
            self.assertEqual(get_res.content_type, 'application/json')
            self.assertIn('.mp3', get_data.get('audio_file'))
            self.assertEqual(get_data.get('author').get('id'), str(self.user.id))

    def test_podcast_update_when_owner(self):
        data = dict(
            title='title1',
            description="lorem ipsum dolor sit",
        )
        data = {key: str(value) for key, value in data.items()}
        data['audio_file'] = self.generate_dummy_podcast_file()
        response = self.client.post(
            '/podcasts',
            data=data,
            content_type='multipart/form-data',
            headers=dict(
                auth_token='Bearer ' + self.user.generate_auth_token()
            ),
        )
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 201)

        patch_res = self.client.patch(
            '/podcasts/' + str(data['id']),
            headers=dict(
                auth_token='Bearer ' + self.user.generate_auth_token()
            ),
            data=json.dumps(
                {'title': 'updated'}
            ),
            content_type='application/json'
        )
        patch_data = json.loads(patch_res.data.decode())
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.content_type, 'application/json')
        self.assertIn('.mp3', patch_data.get('audio_file'))
        self.assertEqual(patch_data.get('title'), 'updated')

    def test_podcast_update_when_not_owner(self):
        data = dict(
            title='title1',
            description="lorem ipsum dolor sit",
        )
        data = {key: str(value) for key, value in data.items()}
        data['audio_file'] = self.generate_dummy_podcast_file()
        response = self.client.post(
            '/podcasts',
            data=data,
            content_type='multipart/form-data',
            headers=dict(
                auth_token='Bearer ' + self.user.generate_auth_token()
            ),
        )
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 201)

        user = User(email='email@mail.com', password='password', username='username')
        db.session.add(user)
        db.session.commit()

        patch_res = self.client.patch(
            '/podcasts/' + str(data['id']),
            headers=dict(
                auth_token='Bearer ' + user.generate_auth_token()
            ),
            data=json.dumps(
                {'title': 'updated'}
            ),
            content_type='application/json'
        )
        self.assertEqual(patch_res.status_code, 403)




if __name__ == '__main__':
    unittest.main()
