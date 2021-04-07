from flask import Blueprint
from app.search.services import get_preview_search, search_users
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


@search.route('/users/<phrase>/<page>')
def search_users_route(phrase, page):
    users = search_users(phrase, page)
    response = {
        'users': UserSchema(many=True).dump(users),
    }
    return response
