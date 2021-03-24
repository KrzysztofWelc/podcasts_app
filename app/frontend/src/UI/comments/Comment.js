import React from "react";

export default function Comment({comment}){
    const {text, created_at, author} = comment
    return(
        <div style={{
            padding: '1rem',
            borderBottom: '1px solid white'
        }}>
            <span style={{fontSize: '20px', marginRight: '1rem'}}>{author.username}</span><span><small>{created_at}</small></span>
            <div className='d-flex'>
                <p style={{width: '90%'}}>{text}</p>
                <div className='d-flex'>
                    <button className="btn btn-success mr-3">
                        <img style={{height: '1.5rem'}} src='/assets/edit.svg' alt="edit icon"/>
                    </button>
                    <button className="btn btn-danger">
                        <img style={{height: '1.5rem'}} src='/assets/delete.svg' alt="edit icon"/>
                    </button>
                </div>
            </div>
        </div>
    )
}