import React, {useState} from "react";
import {useAuth} from "../../contexts/GlobalContext";
import {useHistory} from "react-router-dom";
import AnswerCommentForm from "./answers/AnswerCommentForm";

export default function Comment({comment, editCommentHandler, deleteCommentHandler}) {
    const {text, created_at, author} = comment
    const [isEditMode, setEditMode] = useState(false)
    const [isAnswerMode, setAnswerMode] = useState(false)
    const [editText, setEditText] = useState(text)
    const {currentUser, setPreviewedPodcast} = useAuth()
    const history = useHistory()

    function editSubmitHandler(e) {
        e.preventDefault()
        editCommentHandler(editText, comment.id)
        setEditMode(false)
    }

    function deleteHandler(e) {
        e.preventDefault()
        deleteCommentHandler(comment.id)
    }

    function goToAuthorProfileHandler(e, author_id) {
        e.preventDefault()
        setPreviewedPodcast(null)
        history.push('/user/' + author_id)
    }

    return (
        <div className='p-4 border-b border-white'>
            <a
                onClick={e => goToAuthorProfileHandler(e, author.id)}
                className='font-lg mr-4 cursor-pointer'
            >
                {author.username}
            </a>
            <span><small>{created_at}</small></span>
            <div className='flex align-center'>
                {!isEditMode ?
                    (<p className='w-10/12 p-1'>{text}</p>)
                    :
                    (
                        <form onSubmit={editSubmitHandler} className='w-11/12'>
                        <textarea
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
                            value={editText} onChange={(e) => setEditText(e.target.value)}/>
                            <div>
                                <button type="submit" className="btn">save</button>
                            </div>

                        </form>
                    )}
                <div className='flex'>
                    {currentUser && <button
                        className='btn mr-3'
                        onClick={()=>setAnswerMode(!isAnswerMode)}
                    >Odpowiedz</button>}
                    {currentUser && currentUser.id == author.id && <>
                        <button onClick={() => setEditMode(!isEditMode)} className="btn mr-3">
                            <img className='h-6' src={`${process.env.BASE_URL}assets/edit.svg`} alt="edit icon"/>
                        </button>
                        <button onClick={deleteHandler} className="btn btn-danger">
                            <img className='h-6' src={`${process.env.BASE_URL}assets/delete.svg`} alt="edit icon"/>
                        </button>
                    </>}</div>
            </div>
            {isAnswerMode && (
                <AnswerCommentForm commentId={comment.id}/>
            )}
        </div>
    )
}