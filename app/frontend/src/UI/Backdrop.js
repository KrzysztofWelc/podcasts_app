import React from "react";

export default function Backdrop({clickAction, children}) {
    return (
        <div
            className='flex items-center justify-center z-10 bg-purple-600 bg-opacity-50 fixed inset-0'
            onClick={clickAction ? clickAction : ()=>{}}
        >{children}</div>
    )
}