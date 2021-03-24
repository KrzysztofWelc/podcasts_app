import React, {useState} from "react";

export default function AddCommentSection({addComment}) {
    const [comment, setComment] = useState('')
    const [errors, setErrors] = useState([])

    async function submitHandler(e) {
        e.preventDefault()
        setErrors([])
        if (comment !== '') {
            await addComment(comment)
            setComment('')
        } else {
            setErrors(['comment can not be empty'].concat([...errors]))
        }

    }

    return (
        <form onSubmit={submitHandler}>
            <div className="form-group">
                <label htmlFor="comment-input">Comment</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="form-control"
                          id="comment-input" rows="3"/>
            </div>
            {errors.length ? errors.map(err => <div key={Math.random()}
                                                    className="alert alert-danger">{err}</div>) : null}

            <button type="submit" className="btn btn-success">comment</button>
        </form>
    )
}