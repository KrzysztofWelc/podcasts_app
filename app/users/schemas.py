from marshmallow import Schema, fields, validates_schema, ValidationError
from app.users.models import User


class RegisterSchema(Schema):
    email = fields.Email(required=True)
    username = fields.String(required=True)
    password = fields.String(required=True)
    password2 = fields.String(required=True)

    @validates_schema
    def validate_pwd_check(self, data, **kwargs):
        if data['password'] != data['password2']:
            raise ValidationError({'password2': ['passwords must match.']})

    @validates_schema
    def validate_email_accessibility(self, data, **kwargs):
        user = User.query.filter_by(email=data['email']).first()
        if user:
            raise ValidationError({'email': ['email already taken']})

    @validates_schema
    def validate_username_accessibility(self, data, **kwargs):
        user = User.query.filter_by(username=data['username']).first()
        if user:
            raise ValidationError({'username': ['username already taken']})


class UserSchema(Schema):
    email = fields.Email(required=True)
    username = fields.String(required=True)
    id = fields.String(required=True)
    profile_img = fields.String(required=True)
