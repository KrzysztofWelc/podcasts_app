import os
from flask import Blueprint, request, make_response
from flask.views import MethodView
from marshmallow import ValidationError
from app.users.decorators import login_required
from app.podcasts.schemas import AddPodcastSchema, PodcastSchema, EditPodcastSchema
from app.podcasts.services import create_podcast, get_podcast, update_podcast

podcasts = Blueprint('podcasts', __name__)


class PodcastsAPI(MethodView):

    @login_required
    def post(self):
        try:
            data = AddPodcastSchema().load(request.form)
            audio = request.files.get('audio_file')
            if not audio:
                raise ValidationError({'audio_file': ['audio file is required']})
            if os.path.splitext(audio.filename)[1] != '.mp3':
                raise ValidationError({'audio_file': ['audio file must be in mp3 format']})
            p = create_podcast(data, audio, request.user)
            res = PodcastSchema().dump(p)
            return make_response(res), 201
        except ValidationError as err:
            return make_response(err.messages), 400

    # e.g. route: {{url}}/podcasts/?podcast_id=1
    def get(self):
        podcast_id = request.args.get('podcast_id')
        podcast = get_podcast(podcast_id)
        if not podcast:
            return make_response({'general': 'podcast not found'}), 404
        return make_response(PodcastSchema().dump(podcast)), 200

    def patch(self):
        try:
            data = EditPodcastSchema().load(request.json)
            podcast_id = request.args.get('podcast_id')
            podcast = get_podcast(podcast_id)
            if not podcast:
                return make_response({'general': 'podcast not found'}), 404
            updated_podcast = update_podcast(podcast, data)

            return make_response(PodcastSchema().dump(updated_podcast)), 200
        except ValidationError as err:
            return make_response(err.messages), 400


# accessing this resource you have to have '/' at the end of url
podcasts.add_url_rule(
    '/',
    view_func=PodcastsAPI.as_view('podcasts_api'),
    methods=['POST', 'GET', 'PATCH']
)
