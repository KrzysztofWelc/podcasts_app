from flask import Blueprint
from app.search.services import get_preview_search
from app.users.schemas import UserSchema
from app.podcasts.schemas import PodcastSchema

search = Blueprint('search', __name__)


@search.route('/preview/<phrase>')
def preview(phrase):
    users, podcasts = get_preview_search(phrase)
    response = {
        'users': UserSchema(many=True).dump(users),
        'podcasts': PodcastSchema(many=True).dump(podcasts)
    }
    return response
