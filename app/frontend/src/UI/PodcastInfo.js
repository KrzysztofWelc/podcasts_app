import React, {useState, useEffect} from "react";
import {useAuth} from "../contexts/GlobalContext";
import Backdrop from "./Backdrop";

const style = {
    boxSizing: "border-box",
    width: '100vw',
    zIndex: 100,
    bottom: '0px',
    padding: '1rem',
    paddingBottom: '90px'

}
export default function PodcastInfo() {
    const {previewedPodcast, currentPodcast, setGlobalPodcast, setPreviewedPodcast, isPlaying} = useAuth()
    const [isPlayingLocal, setIsPlayingLocal] = useState(false)

    useEffect(()=>{
        const x = currentPodcast && (previewedPodcast.id == currentPodcast.id) && isPlaying
        setIsPlayingLocal(x)
    }, [currentPodcast, previewedPodcast, isPlaying])

    return (
        <Backdrop clickAction={() => setPreviewedPodcast(null)}>
            <div className='position-fixed bg-dark text-light ' style={style}>
                <h2>{previewedPodcast.title}</h2>
                <p>{previewedPodcast.description}</p>
                <button
                    onClick={(e)=>setGlobalPodcast(previewedPodcast, e)}
                    style={
                        {
                            border: 0,
                            backgroundColor: 'transparent'
                        }}
                    className='mb-3'>
                    <img style={{height: '1.5rem'}} src={`/assets/${ isPlayingLocal ? 'pause' : 'play'}.svg`} alt="play"/>
                </button>
            </div>
        </Backdrop>
    )
}