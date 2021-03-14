from flask import Blueprint, request, make_response
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from app.exceptions import OperationNotPermitted
from app.comments.schemas import AddCommentSchema, CommentSchema
from app.comments.services import create_comment, get_comments, get_single_comment, delete_comment
from app.users.decorators import login_required


comments = Blueprint('comments', __name__)


@comments.route('', methods=['POST'])
@login_required
def post_comment():
    try:
        data = AddCommentSchema().load(request.json)
        comment = create_comment(data, request.user)
        res = CommentSchema().dump(comment)
        return make_response(res), 201
    except ValidationError as err:
        return make_response(err.messages), 400
    except SQLAlchemyError as err:
        return make_response({"_error": 'server error'}), 500


@comments.route('/<podcast_id>/<page>')
def get_comments_list(podcast_id, page):
    try:
        comments = get_comments(podcast_id, page)
        res = {'comments': CommentSchema(many=True).dump(comments)}
        return make_response(res)
    except ValidationError as err:
        return make_response(err.messages), 400
    except SQLAlchemyError as err:
        return make_response({"_error": 'server error'}), 500


@comments.route('/<comment_id>', methods=['DELETE'])
@login_required
def remove_comment(comment_id):
    try:
        comment = get_single_comment(id=comment_id)
        if comment.user_id == request.user.id:
            delete_comment(comment)
        else:
            raise OperationNotPermitted('You cannot delete this comment')
        return make_response()
    except ValidationError as err:
        return make_response(err.messages), 400
    except OperationNotPermitted as err:
        return make_response({'error': err.message}), 401
    except SQLAlchemyError as err:
        return make_response({"_error": 'server error'}), 500
