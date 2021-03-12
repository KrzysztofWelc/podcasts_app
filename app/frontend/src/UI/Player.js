import React, {useState, useEffect, useRef} from "react";

export default function Player({podcastURL}) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentPromile, setCurrentPromile] = useState(0)
    const audio = useRef()

    useEffect(()=>{
        if(!audio.current.paused){
           audio.current.pause()
        }
        audio.current.src = podcastURL
        audio.current.load()
        audio.current.play()
        setIsPlaying(true)
        console.log(audio.current.duration)
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

    const progressHandler = (e) =>{
        const duration = audio.current.duration
        const ctFloat = audio.current.currentTime

        const percent = (ctFloat/duration)*1000
        setCurrentPromile(isNaN(percent) ? 0 : percent)
    }

    function setTimeHandler(e){
        console.log(e.target.value, audio.current.duration)
        const timeValue = parseInt(e.target.value, 10)
        const duration = audio.current.duration
        const ctFloat = (timeValue * duration)/1000

        const percent = (ctFloat/duration)*1000
        setCurrentPromile(percent)

        audio.current.currentTime = ctFloat
    }

    return (
        <div id='player' className='bg-success' style={
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
            <audio
                onTimeUpdate={progressHandler}
                onEnded={()=>setIsPlaying(false)}
                src={podcastURL} ref={audio}/>
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
                {/*<span>{currentTime}</span>*/}
                <input onChange={setTimeHandler} value={currentPromile} min='0' max='1000' type="range" className="form-control-range mx-3"/>
                {/*<span>{duration}</span>*/}
            </div>

        </div>
    )
}