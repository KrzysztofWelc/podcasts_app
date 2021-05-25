from marshmallow import Schema, fields, validates, ValidationError
from app.users.schemas import UserSchema
from app.podcasts.models import Podcast
from app.translations.utils import t


class AddPodcastSchema(Schema):
    title = fields.String(required=True)
    description = fields.String(required=True)

    @validates('title') 
    def validate_title(self, value):
        p = Podcast.query.filter_by(title=value).first()
        if p:
            raise ValidationError(t('title_taken_error'))

        if len(value) > 250:
            raise ValidationError(t('title_too_long_error'))

    @validates('description')
    def validate_description(self, value):
        if len(value) > 2000:
            raise ValidationError(t('desc_too_long_error'))


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
