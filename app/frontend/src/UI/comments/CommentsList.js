import React from "react";

export default function CommentsList({comments}){
    const commentList = comments.length ? comments.map(c=><p key={c.id}>{c.text}</p>) : null

    return (
        <ul>
            {commentList}
        </ul>
    )
}