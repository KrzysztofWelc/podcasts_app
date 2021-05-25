import os
import re
import logging
import sys

from flask import Blueprint, request, make_response, Response, send_from_directory, current_app as app
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from app.translations.utils import t
from app.users.decorators import login_required
from app.podcasts.schemas import AddPodcastSchema, PodcastSchema, EditPodcastSchema
from app.podcasts.services import get_new_podcasts, get_most_popular, create_podcast, find_podcast, update_podcast, \
    get_user_podcasts, delete_podcast
from app.podcasts.utils import get_chunk
from app.exceptions import ResourceNotFound
from app.celery_tasks.tasks import add_view_record

logging.basicConfig(stream=sys.stderr)

podcasts = Blueprint('podcasts', __name__)


@podcasts.route('', methods=['POST'])
@login_required
def post_podcast():
    try:
        data = AddPodcastSchema().load(request.form)
        audio = request.files.get('audio_file')
        cover_img = request.files.get('cover_file')
        if not audio:
            raise ValidationError({'audio_file': [t('no_audio_error')]})
        if os.path.splitext(audio.filename)[1] != '.mp3':
            raise ValidationError({'audio_file': [t('audio_format_error')]})
        p = create_podcast(data, audio, request.user, cover_img)
        res = PodcastSchema().dump(p)
        return make_response(res), 201
    except ValidationError as err:
        return make_response(err.messages), 400
    except SQLAlchemyError as err:
        e = str(err)
        print(e)
        return make_response(e), 500


@podcasts.route('/<podcast_id>', methods=['GET'])
def get_podcast(podcast_id):
    podcast = find_podcast(id=podcast_id)
    if not podcast:
        return make_response({'general': 'podcast not found'}), 404
    return make_response(PodcastSchema().dump(podcast)), 200


@podcasts.route('/all/<user_id>/<page>', methods=['GET'])
def get_all_users_podcasts(user_id, page=1):
    try:
        p, is_more = get_user_podcasts(user_id, page)
        response = {'items': PodcastSchema(many=True).dump(p), 'is_more': is_more}
        return make_response(response)
    except ResourceNotFound as err:
        return make_response({'error': err.message}), 404


@podcasts.route('/newest/<page>', methods=['GET'])
def get_newest_podcasts(page=1):
    try:
        p, is_more = get_new_podcasts(page)
        response = {'items': PodcastSchema(many=True).dump(p), 'is_more': is_more}
        return make_response(response)
    except ResourceNotFound as err:
        return make_response({'error': err.message}), 404


@podcasts.route('/<podcast_id>', methods=['PATCH'])
@login_required
def patch_podcast(podcast_id):
    try:
        data = EditPodcastSchema().load(request.json)
        podcast = find_podcast(id=podcast_id)

        if not podcast:
            return make_response({'general': t('not_found_error')}), 404
        if request.user.id != podcast.author.id:
            return make_response(), 401
        updated_podcast = update_podcast(podcast, data)

        return make_response(PodcastSchema().dump(updated_podcast)), 200
    except ValidationError as err:
        print(err)
        return make_response(err.messages), 400
    except SQLAlchemyError as err:
        e = str(err)
        print(e)
        return make_response(e), 500


@podcasts.route('/<podcast_id>', methods=['DELETE'])
@login_required
def delete_podcast_r(podcast_id):
    try:
        podcast = find_podcast(id=podcast_id)
        if not podcast:
            return make_response({'general': t('not_found_error')}), 404
        if request.user.id != podcast.author.id:
            return make_response(), 401
        delete_podcast(podcast)
        return make_response(), 200
    except ValidationError as err:
        return make_response(err.messages), 400


@podcasts.route('/stream/<podcast_file>')
def stream_podcast(podcast_file):
    range_header = request.headers.get('Range', None)
    byte1, byte2 = 0, None
    if range_header:
        match = re.search(r'(\d+)-(\d*)', range_header)
        groups = match.groups()

        if groups[0]:
            byte1 = int(groups[0])
        if groups[1]:
            byte2 = int(groups[1])

        if byte1 == 0:
            add_view_record.delay(podcast_file)

    chunk, start, length, file_size = get_chunk(podcast_file, byte1, byte2)
    resp = Response(chunk, 206, mimetype='audio/mpeg',
                    content_type='audio/mpeg', direct_passthrough=True)
    resp.headers.add('Content-Range', 'bytes {0}-{1}/{2}'.format(start, start + length - 1, file_size))
    return resp


@podcasts.route('/image/<filename>')
def get_podcast_image(filename):
    covers_dir = os.path.abspath(os.path.join(app.root_path, 'static/podcast_covers'))
    return send_from_directory(covers_dir, filename)


@podcasts.route('/most_popular')
def get_most_popular_podcasts():
    try:
        ps = get_most_popular()
        items = PodcastSchema(many=True).dump(ps)
        return make_response({'items': items, 'more': False}), 200
    except ValidationError as err:
        return make_response(err.messages), 400
    except SQLAlchemyError as err:
        e = str(err)
        print(e)
        return make_response(e), 500
