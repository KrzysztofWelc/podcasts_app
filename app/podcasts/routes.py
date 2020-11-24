from flask import Blueprint, request, make_response
from flask.views import MethodView
from marshmallow import ValidationError
from app.users.decorators import login_required
from app.podcasts.schemas import AddPodcastSchema, PodcastSchema
from app.podcasts.services import create_podcast

podcasts = Blueprint('podcasts', __name__)


class PodcastsAPI(MethodView):

    @login_required
    def post(self):
        try:
            data = AddPodcastSchema().load(request.json)
            p = create_podcast(data, request.user)
            res = PodcastSchema().dump(p)
            return make_response(res), 201
        except ValidationError as err:
            return make_response(err.messages), 400


# accessing this resource you have to have '/' at the end of url
podcasts.add_url_rule(
    '/',
    view_func=PodcastsAPI.as_view('podcasts_api'),
    methods=['POST']
)
