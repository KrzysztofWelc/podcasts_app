from datetime import datetime
from app import db


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(500), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    podcast_id = db.Column(db.Integer, db.ForeignKey('podcast.id'), nullable=False)
