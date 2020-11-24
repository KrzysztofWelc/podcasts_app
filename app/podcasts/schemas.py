from marshmallow import Schema, fields, validates_schema, ValidationError
from app.users.schemas import UserSchema

class AddPodcastSchema(Schema):
    title = fields.String(required=True)
    description = fields.String(required=True)


class PodcastSchema(Schema):
    id = fields.Integer(required=True)
    title = fields.String(required=True)
    description = fields.String(required=True)
    publish_date = fields.String(required=True)
    author = fields.Nested(UserSchema)
