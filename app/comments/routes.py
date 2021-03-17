from flask import Blueprint, request, make_response
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from app.exceptions import OperationNotPermitted
from app.comments.schemas import AddCommentSchema, CommentSchema, PutCommentSchema
from app.comments.services import create_comment, get_comments, get_single_comment, delete_comment, update_comment
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


@comments.route('', methods=['DELETE'])
@login_required
def remove_comment():
    try:
        comment_id = request.json['comment_id']
        comment = get_single_comment(id=comment_id)
        if comment and comment.user_id == request.user.id:
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


@comments.route('', methods=['PUT'])
@login_required
def put_comment():
    try:
        data = PutCommentSchema().load(request.json)
        comment = get_single_comment(id=data['comment_id'])
        if comment and comment.user_id == request.user.id:
            updated_comment = update_comment(comment, text=data['text'])
        else:
            raise OperationNotPermitted('You cannot delete this comment')
        res = CommentSchema().dump(updated_comment)
        return make_response(res)
    except ValidationError as err:
        return make_response(err.messages), 400
    except OperationNotPermitted as err:
        return make_response({'error': err.message}), 401
    except SQLAlchemyError as err:
        return make_response({"_error": 'server error'}), 500