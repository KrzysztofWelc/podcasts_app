from marshmallow import Schema, fields, validates_schema, ValidationError
from app.users.models import User
from app.translations.utils import t


class RegisterSchema(Schema):
    email = fields.Email(required=True)
    username = fields.String(required=True)
    password = fields.String(required=True)
    password2 = fields.String(required=True)

    @validates_schema
    def validate_pwd_check(self, data, **kwargs):
        if data['password'] != data['password2']:
            raise ValidationError({'password2': [t('passwords_match_error')]})

    @validates_schema
    def validate_email_accessibility(self, data, **kwargs):
        user = User.query.filter_by(email=data['email']).first()
        if user:
            raise ValidationError({'email': [t('email_taken_error')]})

    @validates_schema
    def validate_username_accessibility(self, data, **kwargs):
        user = User.query.filter_by(username=data['username']).first()
        if user:
            raise ValidationError({'username': [t('username_taken_error')]})


class ChangePwdSchema(Schema):
    new_pwd = fields.Email(required=True)
    old_pwd = fields.Email(required=True)


class UserSchema(Schema):
    email = fields.Email(required=True)
    username = fields.String(required=True)
    bio = fields.String(required=True)
    id = fields.String(required=True)
    profile_img = fields.String(required=True)


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)


class ChangeBioSchema(Schema):
    bio = fields.String(required=True)

    @validates_schema
    def validate_bio(self, data, **kwargs):
        if len(data['bio']) > 500:
            raise ValidationError({'bio': [t('bio_length_error')]})
