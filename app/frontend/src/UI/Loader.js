import React from "react";

export default function Loader(){
    return(
        <div style={{
            position:'fixed',
            width: '100vw',
            height: '100vh',
            top: 0,
            left: 0,
            backgroundColor: 'white'
        }}
        className='d-flex align-items-center justify-content-center'
        >
            <div className="spinner-border text-success"/>
        </div>
    )
}