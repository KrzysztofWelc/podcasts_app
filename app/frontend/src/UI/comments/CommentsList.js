import React from "react";
import Comment from "./Comment";
import {useTranslation} from "react-i18next";

export default function CommentsList({isMore, comments, nextPageHandler, editCommentHandler, deleteCommentHandler}) {
    const {t} = useTranslation()

    const commentList = comments.length ? comments.map(c => <Comment
        key={c.id}
        editCommentHandler={editCommentHandler}
        deleteCommentHandler={deleteCommentHandler}
        comment={c}
    />) : null

    return (
        <div>
            <ul>
                {commentList}
            </ul>
            {isMore && <button className="btn btn-primary" onClick={nextPageHandler}>{t('more')}</button>}
        </div>

    )
}