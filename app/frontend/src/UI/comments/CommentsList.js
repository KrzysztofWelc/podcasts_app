import React from "react";

export default function CommentsList({comments}){
    const commentList = comments.map(c=><p key={c.id}>{c.text}</p>)

    return (
        <ul>
            {commentList}
        </ul>
    )
}