import React, {useState} from 'react';
import axios from "../../../utils/axios";
import {useCookies} from "react-cookie";

export default function AnswerCommentForm({commentId}) {
    const [answer, setAnswer] = useState('')
    const [errors, setErrors] = useState([])
    const cookies = useCookies()[0]

    async function submitHandler(e) {
        e.preventDefault()
        setErrors([])
        if (answer !== '') {
            try {
                const {data} = await axios.post(
                    `/api/comments/${commentId}/answer`,
                    {
                        text: answer
                    },
                    {
                        headers:{
                            authToken: `Bearer: ${cookies.authToken}`
                        }
                    }
                )
                setAnswer('')
            }catch(e){
                console.log(e)
                setErrors(errors.concat['coś poszło nie tak'])
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