import React from "react";

export default function CommentsList({comments, nextPageHandler}){
    const commentList = comments.length ? comments.map(c=><p key={c.id}>{c.text}</p>) : null

    return (
        <div>
          <ul>
            {commentList}
        </ul>
            <button className="btn btn-primary" onClick={nextPageHandler}>more</button>
        </div>

    )
}