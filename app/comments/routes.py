from flask import Blueprint, request, make_response
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from app.comments.schemas import AddCommentSchema, CommentSchema
from app.comments.services import create_comment
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
