import unittest
import json
from faker import Faker
from app import db
from app.models import User, Podcast, Comment, AnswerComment
from app.tests.base import BaseTestCase

faker = Faker()


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
        for i in range(24):
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
                '/api/comments',
                data=data,
                content_type='application/json',
                headers=dict(
                    authToken='Bearer ' + self.user.generate_auth_token()
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
                '/api/comments/{}/2'.format(self.podcast.id)
            )

            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data.decode())
            self.assertEqual(response.content_type, 'application/json')
            self.assertEqual(len(data['comments']), 10)
            self.assertEqual(data['comments'][0]['text'], 'test comment')
            self.assertTrue(data['is_more'])

    def test_comment_get_end_of_list(self):
        with self.client:
            response = self.client.get(
                '/api/comments/{}/3'.format(self.podcast.id)
            )

            self.assertEqual(response.status_code, 200)
            data = json.loads(response.data.decode())
            self.assertEqual(response.content_type, 'application/json')
            self.assertEqual(len(data['comments']), 4)
            self.assertFalse(data['is_more'])

    def test_comment_delete(self):
        with self.client:
            comment = Comment(text='test', author=self.user, podcast=self.podcast)
            db.session.add(comment)
            db.session.commit()
            response = self.client.delete(
                '/api/comments',
                data=json.dumps(dict(
                    comment_id=comment.id
                )),
                content_type='application/json',
                headers=dict(
                    authToken='Bearer ' + self.user.generate_auth_token()
                )
            )

            self.assertEqual(response.status_code, 200)

            check = Comment.query.filter_by(id=comment.id).first()
            self.assertFalse(check)

    def test_comment_update(self):
        with self.client:
            updated_text = 'hello123'
            comment = Comment(text='test', author=self.user, podcast=self.podcast)
            db.session.add(comment)
            db.session.commit()
            response = self.client.put(
                '/api/comments',
                data=json.dumps(dict(
                    text=updated_text,
                    comment_id=comment.id
                )),
                content_type='application/json',
                headers=dict(
                    authToken='Bearer ' + self.user.generate_auth_token()
                )
            )

            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.content_type, 'application/json')
            data = json.loads(response.data.decode())
            self.assertEqual(data['text'], updated_text)

            check = Comment.query.filter_by(id=comment.id).first()
            self.assertEqual(check.text, updated_text)
            self.assertEqual(data['text'], updated_text)

    def test_comment_answer(self):
        answer_text = faker.sentence(nb_words=10)
        comment = Comment(
            text=faker.sentence(nb_words=10),
            podcast_id=self.podcast.id,
            user_id=self.user.id
        )
        db.session.add(comment)
        db.session.commit()

        with self.client:
            response = self.client.post(
                '/api/comments/{}/answer'.format(comment.id),
                data=json.dumps({
                    'text': answer_text
                }),
                content_type='application/json',
                headers=dict(
                    authToken='Bearer ' + self.user.generate_auth_token()
                )
            )

            self.assertEqual(response.status_code, 201)
            self.assertEqual(response.content_type, 'application/json')
            data = json.loads(response.data.decode())
            self.assertEqual(data['text'], answer_text)
            self.assertEqual(data.get('author').get('id'), str(self.user.id))
            self.assertEqual(data['comment_id'], comment.id)
            self.assertTrue(data['created_at'])
            self.assertTrue(data['id'])

            comment_check = comment.answers.first()
            self.assertEqual(comment_check.text, answer_text)

    def test_comment_answer_not_permitted(self):
        answer_text = faker.sentence(nb_words=10)
        comment = Comment(
            text=faker.sentence(nb_words=10),
            podcast_id=self.podcast.id,
            user_id=self.user.id
        )
        db.session.add(comment)
        db.session.commit()

        wrong_user = User(email=faker.email, username='imwrong', password='dasdsadsa')
        wrong_token = wrong_user.generate_auth_token()

        with self.client:
            response = self.client.post(
                '/api/comments/{}/answer'.format(comment.id),
                data=json.dumps({
                    'text': answer_text
                }),
                content_type='application/json',
                headers=dict(
                    authToken='Bearer ' + wrong_token
                )
            )

            self.assertEqual(response.status_code, 401)

    def test_get_paginated_answers(self):
        comment = Comment(
            text=faker.sentence(nb_words=10),
            podcast_id=self.podcast.id,
            user_id=self.user.id
        )
        db.session.add(comment)
        for i in range(50):
            a = AnswerComment(
                text=faker.sentence(nb_words=20),
                comment=comment,
                user_id=self.user.id
            )
            db.session.add(a)

        db.session.commit()

        with self.client:
            response = self.client.get(
                '/api/comments/{}/answers/2'.format(comment.id),
                content_type='application/json'
            )

            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.content_type, 'application/json')
            data = json.loads(response.data.decode())
            self.assertTrue(data['is_more'])
            self.assertEqual(len(data['items']), 10)

    def test_delete_answer(self):
        comment = Comment(
            text=faker.sentence(nb_words=10),
            podcast_id=self.podcast.id,
            user_id=self.user.id
        )
        db.session.add(comment)

        a = AnswerComment(
            text=faker.sentence(nb_words=20),
            comment=comment,
            user_id=self.user.id
        )
        db.session.add(a)
        db.session.commit()

        with self.client:
            response = self.client.delete(
                '/api/comments/answer/{}'.format(a.id),
                content_type='application/json',
                headers=dict(
                    authToken='Bearer ' + self.user.generate_auth_token()
                )
            )

            self.assertEqual(response.status_code, 200)

            check = AnswerComment.query.filter_by(id=a.id).first()
            self.assertFalse(check)

    def test_patch_answer(self):
        new_text = faker.sentence(nb_words=12)
        comment = Comment(
            text=faker.sentence(nb_words=10),
            podcast_id=self.podcast.id,
            user_id=self.user.id
        )
        db.session.add(comment)

        a = AnswerComment(
            text=faker.sentence(nb_words=20),
            comment=comment,
            user_id=self.user.id
        )
        db.session.add(a)
        db.session.commit()

        with self.client:
            response = self.client.patch(
                '/api/comments/answer/{}'.format(a.id),
                content_type='application/json',
                data=json.dumps({
                    'text': new_text
                }),
                headers=dict(
                    authToken='Bearer ' + self.user.generate_auth_token()
                )
            )

            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.content_type, 'application/json')
            data = json.loads(response.data.decode())
            self.assertEqual(data['text'], new_text)
