import React, {useState, useEffect, useRef} from "react";
import throttle from "lodash.throttle";
import debounce from "lodash.debounce";


export default function Player({podcastURL}) {
    const [isPlaying, setIsPlaying] = useState(false)
    // const [duration, setDuration] = useState(false)
    const [currentTime, setCurrentTime] = useState('00:00')
    const audio = useRef()

    useEffect(()=>{
        if(!audio.current.paused){
           audio.current.pause()
        }
        audio.current.src = podcastURL
        audio.current.load()
        audio.current.play()
        setIsPlaying(true)
        // setDuration(audio.current.duration)
    }, [podcastURL])

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

    const progressHandler =(e)=>{
        e.persist()
        const raw_time = Math.round(e.target.currentTime)
        const mins = Math.floor(raw_time/60)
        const secs = raw_time - mins*60

        setCurrentTime(`${mins}:${secs}`)
    }

    return (
        <div id='player' className='bg-primary' style={
            {
            position: 'fixed',
            bottom: 0,
            left: 0,
            color: 'white',
            width: '100vw',
            height: '90px',
            padding: '1rem',
            boxSizing: 'border-box',
            textAlign: 'center'
        }}>
            <audio onTimeUpdate={progressHandler} src={podcastURL} ref={audio}/>
            <button
                onClick={playPauseHandler}
                style={
                    {
                border: 0,
                backgroundColor: 'transparent'
            }}
            className='mb-3'>
                <img style={{height: '1.5rem'}} src={`/assets/${isPlaying ? 'pause' : 'play'}.svg`} alt="play"/>
            </button>
            <div style={
                {
                margin: 'auto',
                width: '70%',
                display: 'flex'
            }}>
                <span>{currentTime}</span>
                <input min='0' max='100' type="range" defaultValue='0' className="form-control-range mx-3"/>
                <span></span>
            </div>

        </div>
    )
}