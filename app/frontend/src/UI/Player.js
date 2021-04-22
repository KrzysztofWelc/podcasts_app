import React, {useState, useEffect, useRef} from "react";
import {useAuth} from "../contexts/GlobalContext";


export default function Player() {
    const {podcastURL, isPlaying, setIsPlaying} = useAuth()
    const [currentPromile, setCurrentPromile] = useState(0)
    const audio = useRef()

    useEffect(() => {
        audio.current.src = podcastURL
        audio.current.load()
        audio.current.currentTime = 0
        setCurrentPromile(0)
        setIsPlaying(true)
    }, [podcastURL])

    useEffect(() => {
        if (isPlaying) {
            audio.current.play()
        } else {
            audio.current.pause()
        }
    }, [isPlaying])

    function playPauseHandler(e) {
        e.preventDefault()
        if (audio.current.paused) {
            audio.current.play()
            setIsPlaying(true)
        } else {
            audio.current.pause()
            setIsPlaying(false)
        }
    }

    const progressHandler = (e) => {
        const duration = audio.current.duration
        const ctFloat = audio.current.currentTime

        const percent = (ctFloat / duration) * 1000
        setCurrentPromile(isNaN(percent) ? 0 : percent)
    }

    function setTimeHandler(e) {
        console.log(e.target.value, audio.current.duration)
        const timeValue = parseInt(e.target.value, 10)
        const duration = audio.current.duration
        const ctFloat = (timeValue * duration) / 1000

        const percent = (ctFloat / duration) * 1000
        setCurrentPromile(percent)

        audio.current.currentTime = ctFloat
    }

    return (
        <div id='player' className='fixed inset-x-0 bottom-0 z-50 border-box p-4 bg-green-500 text-center'>
            <audio
                onTimeUpdate={progressHandler}
                onEnded={() => setIsPlaying(false)}
                src={podcastURL} ref={audio}/>
            <button
                onClick={playPauseHandler}
                className='mb-3 border-0 bg-transparent'>
                <img style={{height: '1.5rem'}} src={`/assets/${isPlaying ? 'pause' : 'play'}.svg`} alt="play"/>
            </button>
            <div className='mx-auto w-8/12 flex-1'>
                {/*<span>{currentTime}</span>*/}
                <input onChange={setTimeHandler} value={currentPromile} min='0' max='1000' type="range"
                       className="w-full mx-3"/>
                {/*<span>{duration}</span>*/}
            </div>

        </div>
    )
}