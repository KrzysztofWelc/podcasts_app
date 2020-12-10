import unittest
import json
import io

from app import db
from app.models import User
from app.tests.base import BaseTestCase


class TestPodcastsPackage(BaseTestCase):
    def setUp(self):
        super(TestPodcastsPackage, self).setUp()
        email = 'test1@mail.com'
        password = 'Test1234'
        username = 'test1'

        user = User(email=email, password=password, username=username)
        db.session.add(user)
        db.session.commit()

    def tearDown(self):
        super(TestPodcastsPackage, self).tearDown()

    def generate_dummy_podcast_file(self):
        bytes_header = b"\xff\xfb\xd6\x04"
        filler = b"\x01" * 800
        file = (io.BytesIO(bytes_header + filler), 'test.mp3')
        return file

    def test_podcast_add(self):
        with self.client:
            response = self.client.post(
                '/podcasts',
                data=json.dumps(dict(
                    title='title1',
                    description="lorem ipsum dolor sit",
                    audio_file=self.generate_dummy_podcast_file()
                )),
                content_type='multipart/form-data'
            )
            self.assertEqual(response.status_code, 201)


if __name__ == '__main__':
    unittest.main()
