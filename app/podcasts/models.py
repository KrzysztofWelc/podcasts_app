from app import db
from datetime import date, datetime


class Podcast(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(250), nullable=False, unique=True)
    description = db.Column(db.String(2000))
    publish_date = db.Column(db.String(60))
    audio_file = db.Column(db.String(60), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    cover_img = db.Column(db.String(60), nullable=False, default='default.jpg')
    comments = db.relationship('Comment', backref='podcast', lazy='dynamic')
    views = db.relationship('View',  backref='podcast', lazy='dynamic')

    def __init__(self, title, description, author, audio_file=None):
        self.title = title
        self.description = description
        self.publish_date = date.today()
        self.author = author
        self.audio_file = audio_file


class View(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.String(20), default=date.today)
    podcast_id = db.Column(db.Integer, db.ForeignKey('podcast.id'))


class PopularPodcast(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    podcast_id = db.Column(db.Integer, nullable=False)
    views = db.Column(db.Integer, nullable=False)
