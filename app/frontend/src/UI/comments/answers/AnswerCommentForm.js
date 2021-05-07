import React, {useState} from 'react';
import {useAnswers} from "../../../contexts/AnswersContext";

export default function AnswerCommentForm() {
    const [answer, setAnswer] = useState('')
    const [errors, setErrors] = useState([])
    const {addAnswer} = useAnswers()

    async function submitHandler(e) {
        e.preventDefault()
        setErrors([])
        if (answer !== '') {
            const err = await addAnswer(answer)
            if (err) {
                setErrors([err])
            } else {
                setAnswer('')
            }
            
        } else {
            setErrors(['comment can not be empty'].concat([...errors]))
        }

    }

    return (
        <form
            className='mt-4 ml-8'
            onSubmit={submitHandler}>
            <div className="form-group">
                <label htmlFor="comment-input">Odpowiedź</label>
                <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                          id="comment-input" rows="3"/>
            </div>
            {errors.length ? errors.map(err => <div key={Math.random()}
                                                    className="alert-danger mb-3">{err}</div>) : null}

            <button type="submit" className="btn">odpowiedz</button>
        </form>
    )

}