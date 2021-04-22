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
        <form
            className='mt-4'
            onSubmit={submitHandler}>
            <div className="form-group">
                <label htmlFor="comment-input">Comment</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                          id="comment-input" rows="3"/>
            </div>
            {errors.length ? errors.map(err => <div key={Math.random()}
                                                    className="alert-danger mb-3">{err}</div>) : null}

            <button type="submit" className="btn">comment</button>
        </form>
    )
}