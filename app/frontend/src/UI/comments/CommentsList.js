import React from "react";
import {useComments} from "../../contexts/CommentsContext";

export default function CommentsList(){
    const {comments} = useComments()

    const commentList = comments.map(c=><p>{c.id}</p>)

    return (
        <ul>
            {commentList}
        </ul>
    )
}