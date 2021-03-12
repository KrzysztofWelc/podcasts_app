from flask import Blueprint, request, make_response
from app.comments.schemas import AddCommentSchema, CommentSchema
from app.comments.services import create_comment

comments = Blueprint('comments', __name__)


@comments.route('', methods=['POST'])
def post_comment():
    try:
        data = AddCommentSchema().load(request.json)
        comment = create_comment(data, request.user)
        res = CommentSchema().dump(comment)
        return make_response(res), 201
    except:
        pass