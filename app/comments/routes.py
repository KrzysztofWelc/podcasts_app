from flask import Blueprint, request, make_response
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from app.exceptions import OperationNotPermitted, ResourceNotFound
from app.comments.schemas import AddCommentSchema, CommentSchema, PutCommentSchema, AnswerSchema
from app.comments.services import create_comment, get_comments, get_single_comment, delete_comment, update_comment, \
    answer_comment, get_answers, delete_answer, patch_answer
from app.translations.utils import t
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
        return make_response({"_error": t('server_error')}), 500


@comments.route('/<podcast_id>/<page>')
def get_comments_list(podcast_id, page):
    try:
        coms, is_more = get_comments(podcast_id, page)
        res = {'comments': CommentSchema(many=True).dump(coms), 'is_more': is_more}
        return make_response(res)
    except ValidationError as err:
        return make_response(err.messages), 400
    except SQLAlchemyError as err:
        return make_response({"_error": t('server_error')}), 500


@comments.route('', methods=['DELETE'])
@login_required
def remove_comment():
    try:
        comment_id = request.json['comment_id']
        comment = get_single_comment(id=comment_id)

        if not comment:
            raise ResourceNotFound(t('not_found_error'))
        elif comment.user_id != request.user.id:
            raise OperationNotPermitted(t('cant_do_error'))
        else:
            delete_comment(comment)
            return make_response()

    except ValidationError as err:
        return make_response(err.messages), 400
    except OperationNotPermitted as err:
        return make_response({'error': err.message}), 401
    except ResourceNotFound as err:
        return make_response({'error': err.message}), 404
    except SQLAlchemyError as _err:
        return make_response({"_error": t('server_error')}), 500


@comments.route('', methods=['PUT'])
@login_required
def put_comment():
    try:
        data = PutCommentSchema().load(request.json)
        comment = get_single_comment(id=data['comment_id'])
        if comment and comment.user_id == request.user.id:
            updated_comment = update_comment(comment, text=data['text'])
        else:
            raise OperationNotPermitted(t('cant_do_error'))
        res = CommentSchema().dump(updated_comment)
        return make_response(res)
    except ValidationError as err:
        return make_response(err.messages), 400
    except OperationNotPermitted as err:
        return make_response({'error': err.message}), 401
    except SQLAlchemyError as err:
        return make_response({"_error": t('server_error')}), 500


@comments.route('/<comment_id>/answer', methods=['POST'])
@login_required
def comment_answer(comment_id):
    try:
        text = request.json.get('text')
        if not text:
            raise ValidationError(t('text_required_error'))
        a = answer_comment(comment_id, text, request.user)
        res = AnswerSchema().dump(a)
        return make_response(res), 201
    except ValidationError as err:
        return make_response(err.messages), 400
    except OperationNotPermitted as err:
        return make_response({'error': err.message}), 401
    except SQLAlchemyError as err:
        return make_response({"_error": t('server_error')}), 500


@comments.route('/answer/<answer_id>', methods=['DELETE'])
@login_required
def delete_answer_route(answer_id):
    try:

        delete_answer(answer_id)
        return make_response(), 200
    except ValidationError as err:
        return make_response(err.messages), 400
    except OperationNotPermitted as err:
        return make_response({'error': err.message}), 401
    except SQLAlchemyError as err:
        return make_response({"_error": t('server_error')}), 500


@comments.route('/answer/<answer_id>', methods=['PATCH'])
@login_required
def patch_answer_route(answer_id):
    try:
        text = request.json.get('text')
        if not text:
            raise ValidationError(t('text_required_error'))
        a = patch_answer(answer_id, text)
        res = AnswerSchema().dump(a)
        return make_response(res), 200
    except ValidationError as err:
        return make_response(err.messages), 400
    except OperationNotPermitted as err:
        return make_response({'error': err.message}), 401
    except SQLAlchemyError as err:
        return make_response({"_error": t('server_error')}), 500


@comments.route('/<comment_id>/answers/<page>', methods=['GET'])
def get_answers_list(comment_id, page):
    try:
        answers, is_more = get_answers(comment_id, page)
        res = {
            'items': AnswerSchema(many=True).dump(answers),
            'is_more': is_more
        }
        return make_response(res), 200
    except ValidationError as err:
        return make_response(err.messages), 400
    except OperationNotPermitted as err:
        return make_response({'error': err.message}), 401
    except SQLAlchemyError as err:
        return make_response({"_error": t('server_error')}), 500
