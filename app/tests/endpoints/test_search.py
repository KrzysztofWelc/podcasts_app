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

        for i in range(6):
            p = Podcast(author=self.user, title='preview_test{}'.format(i), description='lorem ipsum')
            p.audio_file = 'test.mp3'
            db.session.add(p)
        for i in range(6):
            p = User(email='testdas{}@mail.com'.format(i), password='User1234', username='preview_user{}'.format(i))
            db.session.add(p)
        db.session.commit()

        self.real_podcasts = get_real_podcasts()

    def tearDown(self):
        super(TestPodcastsPackage, self).tearDown()
        delete_dummy_podcasts(self.real_podcasts)

    def test_search_podcast_preview(self):
        with self.client:
            response = self.client.get('/api/search/preview/preview')

            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data['users']), 3)
            self.assertEqual(len(data['podcasts']), 3)
            for el in data['users']:
                self.assertTrue('preview' in el.get('username'))
            for el in data['podcasts']:
                self.assertTrue('preview' in el.get('title'))

    def test_search_users(self):
        with self.client:
            response = self.client.get('/api/search/users/preview/1')

            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data['items']), 6)
            self.assertFalse(data['is_more'])
            for el in data['items']:
                self.assertTrue('preview' in el.get('username'))

    def test_search_podcasts(self):
        with self.client:
            response = self.client.get('/api/search/podcasts/preview/1')

            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data['items']), 6)
            self.assertFalse(data['is_more'])
            for el in data['items']:
                self.assertTrue('preview' in el.get('title'))

