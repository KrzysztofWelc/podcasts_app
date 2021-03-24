import React, {useState} from "react";
import {useAuth} from "../../contexts/GlobalContext";

export default function Comment({comment, editCommentHandler}) {
    const {text, created_at, author} = comment
    const [isEditMode, setEditMode] = useState(false)
    const [editText, setEditText] = useState(text)
    const {currentUser} = useAuth()

    function editSubmitHandler(e) {
        e.preventDefault()
        editCommentHandler(editText, comment.id)
        setEditMode(false)
    }

    return (
        <div style={{
            padding: '1rem',
            borderBottom: '1px solid white'
        }}>
            <span style={{
                fontSize: '20px',
                marginRight: '1rem'
            }}>{author.username}</span><span><small>{created_at}</small></span>
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
                        <img style={{height: '1.5rem'}} src='/assets/edit.svg' alt="edit icon"/>
                    </button>
                    <button className="btn btn-danger">
                        <img style={{height: '1.5rem'}} src='/assets/delete.svg' alt="edit icon"/>
                    </button>
                </div>)}
            </div>
        </div>
    )
}