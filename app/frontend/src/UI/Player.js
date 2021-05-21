import React, {useState, useEffect, useRef} from "react";
import {useAuth} from "../contexts/GlobalContext";


export default function Player() {
    const {podcastURL, isPlaying, setIsPlaying, currentPodcast, hasInteractedBefore, setHasInteractedBefore, currentTime} = useAuth()
    const [currentPromile, setCurrentPromile] = useState(0)
    const audio = useRef()

    useEffect(() => {
        audio.current.src = podcastURL
        audio.current.load()
        audio.current.currentTime = 0
        setCurrentPromile(0)
        if(currentTime && !hasInteractedBefore){
            audio.current.currentTime = currentTime
        }

        if(hasInteractedBefore){
            setIsPlaying(true)
        }
    }, [podcastURL])

    useEffect(() => {
        setHasInteractedBefore(true)
        if (isPlaying) {
            audio.current.play()
        } else {
            audio.current.pause()
        }
    }, [isPlaying])

    useEffect(()=>{
        return ()=>{
            const currentTime = audio.current.currentTime
            localStorage.setItem('podcast_time', JSON.stringify(currentTime))
        }
    })

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
        <div id='player' className='fixed inset-x-0 bottom-0 z-50 border-box p-4 bg-purple-900 text-center h-24'>
            <audio
                onTimeUpdate={progressHandler}
                onEnded={() => setIsPlaying(false)}
                src={podcastURL} ref={audio}/>
            <div className='flex align-center justify-center' >
                <button
                onClick={playPauseHandler}
                className='mb-3 border-0 bg-transparent'>
                <img style={{height: '1.5rem'}} src={`${process.env.BASE_URL}assets/${isPlaying ? 'pause' : 'play'}.svg`} alt="play"/>
            </button>
            <h3 className='ml-4 text-xl text-white inline'>{currentPodcast.title}</h3>
            </div>

            <div className='mx-auto w-8/12 flex-1'>
                {/*<span>{currentTime}</span>*/}
                <input onChange={setTimeHandler} value={currentPromile} min='0' max='1000' type="range"
                       className="w-full mx-3"/>
                {/*<span>{duration}</span>*/}
            </div>

        </div>
    )
}