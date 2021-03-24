from marshmallow import Schema, fields, validates, ValidationError
from app.users.schemas import UserSchema
from app.podcasts.schemas import PodcastSchema


class AddCommentSchema(Schema):
    text = fields.String(required=True)
    podcast_id = fields.Number(required=True)


class CommentSchema(Schema):
    id = fields.Integer(required=True)
    text = fields.String(required=True)
    author = fields.Nested(UserSchema)
    created_at = fields.String(required=True)
    podcasts = fields.Nested(PodcastSchema)


class PutCommentSchema(Schema):
    text = fields.String(required=True)
    comment_id = fields.Number(required=True)