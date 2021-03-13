from marshmallow import Schema, fields, validates, ValidationError
from app.users.schemas import UserSchema
from app.podcasts.models import Podcast


class AddPodcastSchema(Schema):
    title = fields.String(required=True)
    description = fields.String(required=True)

    @validates('title') 
    def validate_title(self, value):
        p = Podcast.query.filter_by(title=value).first()
        if p:
            raise ValidationError('Title already taken.')


class EditPodcastSchema(Schema):
    title = fields.String()
    description = fields.String()


class PodcastSchema(Schema):
    id = fields.Integer(required=True)
    title = fields.String(required=True)
    description = fields.String(required=True)
    publish_date = fields.String(required=True)
    audio_file = fields.String(required=True)
    cover_img = fields.String()
    author = fields.Nested(UserSchema)
