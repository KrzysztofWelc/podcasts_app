import React, {useState} from "react";
import {useAuth} from "../contexts/AuthContext";

export default function Player() {
    const {podcastURL} = useAuth()

    if(!podcastURL){
        return null
    }

    const audio = new Audio(podcastURL)

    function playPauseHandler(e){
        e.preventDefault()
        if(audio.paused){
            audio.play()
        }else {
            audio.pause()
        }
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            width: '100vw',
            height: '150px'
        }}
        className='d-fex align-items-center justify-content-center'>
            <button onClick={playPauseHandler}>play</button>
        </div>
    )
}