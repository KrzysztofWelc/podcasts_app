from app import db
from datetime import datetime


class Podcast(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(45), nullable=False, unique=True)
    description = db.Column(db.String(500))
    publish_date = db.Column(db.String(25))
    audio_file = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    cover_img = db.Column(db.String(20), nullable=False, default='default.jpg')
    comments = db.relationship('Comment', backref='podcast', lazy='dynamic')
    views = db.relationship('View',  backref='podcast', lazy='dynamic')

    def __init__(self, title, description, author):
        self.title = title
        self.description = description
        self.publish_date = datetime.now().strftime("%m/%d/%Y")
        self.author = author


class View(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime(25), default=datetime.now)
    podcast_id = db.Column(db.Integer, db.ForeignKey('podcast.id'), nullable=False)
