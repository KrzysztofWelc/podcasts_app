import unittest
import json
from app import db
from app.models import User, Podcast, Comment
from app.tests.base import BaseTestCase


class TestPodcastsPackage(BaseTestCase):
    def setUp(self):
        super(TestPodcastsPackage, self).setUp()

        email = 'test1@mail.com'
        password = 'Test1234'
        username = 'test1'
        title = 'testP-p'
        description = 'lorem ipsum'
        file = 'test.mp3'

        user = User(email=email, password=password, username=username)
        podcast = Podcast(author=user, title=title, description=description)
        podcast.audio_file = 'test.mp3'
        db.session.add(user)
        db.session.add(podcast)
        for i in range(20):
            comment = Comment(text='test comment', author=user, podcast=podcast)
            db.session.add(comment)
        db.session.commit()
        self.user = user
        self.podcast = podcast

    def tearDown(self):
        super(TestPodcastsPackage, self).tearDown()

    def test_comment_add(self):
        text = 'great!'
        data = json.dumps(dict(
            text=text,
            podcast_id=self.podcast.id,
        ))

        with self.client:
            data = data
            response = self.client.post(
                '/comments',
                data=data,
                content_type='application/json',
                headers=dict(
                    auth_token='Bearer ' + self.user.generate_auth_token()
                ),
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.content_type, 'application/json')
            self.assertEqual(data['text'], text)
            self.assertEqual(data['author']['id'], str(self.user.id))

    def test_comment_get(self):
        with self.client:
            response = self.client.get(
                '/comments/{}/2'.format(self.podcast.id)
            )

            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data.decode())
            self.assertEqual(response.content_type, 'application/json')
            self.assertEqual(len(data['comments']), 10)
            self.assertEqual(data['comments'][0]['text'], 'test comment')
