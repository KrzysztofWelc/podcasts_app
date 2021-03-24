import React, {useState} from "react";

export default function AddCommentSection({addComment}){
    const [comment, setComment] = useState('')
    const [errors, setErrors] = useState(null)

    async function submitHandler(e){
        e.preventDefault()
        await addComment(comment)
        setComment('')
    }

    return(
        <form onSubmit={submitHandler}>
            <div className="form-group">
                <label htmlFor="comment-input">Comment</label>
                <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="form-control" id="comment-input" rows="3"/>
            </div>
            <button type="submit" className="btn btn-success">comment</button>
        </form>
    )
}