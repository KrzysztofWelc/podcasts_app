import React from "react";

export default function Backdrop({clickAction, children}) {
    return (
        <div
            className='flex-1 items-center justify-center z-30 bg-green-500 bg-opacity-50 fixed inset-0'
            onClick={clickAction ? clickAction : ()=>{}}
        >{children}</div>
    )
}