from app import db
from datetime import datetime


class Podcast(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(45), nullable=False)
    description = db.Column(db.String(500))
    publish_date = db.Column(db.String(25))
    # file = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __init__(self, title, description, author):
        self.title = title
        self.description = description
        self.publish_date = datetime.now().strftime("%m/%d/%Y")
        self.author = author