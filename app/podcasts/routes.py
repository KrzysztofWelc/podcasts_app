import os
import re

from flask import Blueprint, request, make_response, Response
from flask.views import MethodView
from marshmallow import ValidationError
from app.users.decorators import login_required
from app.podcasts.schemas import AddPodcastSchema, PodcastSchema, EditPodcastSchema
from app.podcasts.services import create_podcast, get_podcast, update_podcast, delete_podcast
from app.podcasts.utils import get_chunk

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
        podcast = get_podcast(id=podcast_id)
        if not podcast:
            return make_response({'general': 'podcast not found'}), 404
        return make_response(PodcastSchema().dump(podcast)), 200

    def patch(self):
        try:
            data = EditPodcastSchema().load(request.json)
            podcast_id = request.args.get('podcast_id')
            podcast = get_podcast(id=podcast_id)
            if not podcast:
                return make_response({'general': 'podcast not found'}), 404
            updated_podcast = update_podcast(podcast, data)

            return make_response(PodcastSchema().dump(updated_podcast)), 200
        except ValidationError as err:
            return make_response(err.messages), 400

    def delete(self):
        try:
            podcast_id = request.args.get('podcast_id')
            podcast = get_podcast(id=podcast_id)
            if not podcast:
                return make_response({'general': 'podcast not found'}), 404
            delete_podcast(podcast)
            return make_response(), 200
        except ValidationError as err:
            return make_response(err.messages), 400


# accessing this resource you have to have '/' at the end of url
podcasts.add_url_rule(
    '/',
    view_func=PodcastsAPI.as_view('podcasts_api'),
    methods=['POST', 'GET', 'PATCH', 'DELETE']
)


@podcasts.route('/stream/<podcast_file>')
def stream(podcast_file):
    range_header = request.headers.get('Range', None)
    byte1, byte2 = 0, None
    if range_header:
        match = re.search(r'(\d+)-(\d*)', range_header)
        groups = match.groups()

        if groups[0]:
            byte1 = int(groups[0])
        if groups[1]:
            byte2 = int(groups[1])

    chunk, start, length, file_size = get_chunk(podcast_file, byte1, byte2)
    resp = Response(chunk, 206, mimetype='audio/mpeg',
                    content_type='audio/mpeg', direct_passthrough=True)
    resp.headers.add('Content-Range', 'bytes {0}-{1}/{2}'.format(start, start + length - 1, file_size))
    return resp
