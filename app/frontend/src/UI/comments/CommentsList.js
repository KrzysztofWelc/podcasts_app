import React from "react";
import Comment from "./Comment";


export default function CommentsList({comments, nextPageHandler, editCommentHandler}){
    const commentList = comments.length ? comments.map(c=><Comment key={c.id} editCommentHandler={editCommentHandler} comment={c}/>) : null

    return (
        <div>
          <ul>
            {commentList}
        </ul>
            <button className="btn btn-primary" onClick={nextPageHandler}>more</button>
        </div>

    )
}