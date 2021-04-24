import React, {useState} from "react";
import {useAuth} from "../../contexts/GlobalContext";
import {useHistory} from "react-router-dom";

export default function Comment({comment, editCommentHandler, deleteCommentHandler}) {
    const {text, created_at, author} = comment
    const [isEditMode, setEditMode] = useState(false)
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

    function goToAuthorProfileHandler(e, author_id){
        e.preventDefault()
        setPreviewedPodcast(null)
        history.push('/user/' + author_id)
    }

    return (
        <div style={{
            padding: '1rem',
            borderBottom: '1px solid white'
        }}>
            <a onClick={e=>goToAuthorProfileHandler(e, author.id)} style={{
                fontSize: '20px',
                marginRight: '1rem'
            }}>{author.username}</a><span><small>{created_at}</small></span>
            <div className='d-flex align-items-center'>
                {!isEditMode ? (<p style={{width: '90%'}}>{text}</p>) : (
                    <form onSubmit={editSubmitHandler} style={{width: '90%'}}>
                        <textarea value={editText} onChange={(e) => setEditText(e.target.value)}/>
                        <div>
                            <button type="submit" className="btn btn-success">save</button>
                        </div>

                    </form>
                )}
                {currentUser.id == author.id && (<div className='d-flex'>
                    <button onClick={() => setEditMode(!isEditMode)} className="btn btn-success mr-3">
                        <img style={{height: '1.5rem'}} src={`${process.env.BASE_URL}assets/edit.svg`} alt="edit icon"/>
                    </button>
                    <button onClick={deleteHandler} className="btn btn-danger">
                        <img style={{height: '1.5rem'}} src={`${process.env.BASE_URL}assets/delete.svg`} alt="edit icon"/>
                    </button>
                </div>)}
            </div>
        </div>
    )
}