import React from "react";

export default function Backdrop({clickAction, children}) {
    return (
        <div
            style={{
                position: 'fixed',
                width: '100vw',
                height: '100vh',
                top: 0,
                left: 0,
                backgroundColor: 'rgba(55, 173, 0, 0.48)',
                zIndex: 50
            }}
            className='d-flex align-items-center justify-content-center'
            onClick={clickAction ? clickAction : ()=>{}}
        >{children}</div>
    )
}