import React, {useState, useEffect} from "react";
import {useAuth} from "../contexts/GlobalContext";
import Backdrop from "./Backdrop";
import CommentsSection from "./comments/CommentsSection";

const style = {
    boxSizing: "border-box",
    maxHeight: '70vh',
    zIndex: 100,
    bottom: '0px',
    padding: '1rem',
    overflowY: 'auto'

}
export default function PodcastInfo() {
    const {previewedPodcast, currentPodcast, setGlobalPodcast, setPreviewedPodcast, isPlaying, podcastURL} = useAuth()
    const [isPlayingLocal, setIsPlayingLocal] = useState(false)

    useEffect(() => {
        const x = currentPodcast && (previewedPodcast.id == currentPodcast.id) && isPlaying
        setIsPlayingLocal(x)
    }, [currentPodcast, previewedPodcast, isPlaying])

    return (
        <>
            <Backdrop clickAction={() => setPreviewedPodcast(null)}/>
            <div className='position-relative bg-dark text-light ' style={style}>
                <button
                    onClick={() => setPreviewedPodcast(null)}
                    style={{border: 0, backgroundColor: "transparent", position: "absolute", top: '1rem', right: '1rem'}}>
                    <img src={`${process.env.BASE_URL}static/assets/close.svg`} alt="x"/>
                </button>
                <h2>{previewedPodcast.title}</h2>
                <p>{previewedPodcast.description}</p>
                <button
                    onClick={(e) => setGlobalPodcast(previewedPodcast, e)}
                    style={
                        {
                            border: 0,
                            backgroundColor: 'transparent'
                        }}
                    className='mb-3'>
                    <img style={{height: '1.5rem'}} src={`/assets/${isPlayingLocal ? 'pause' : 'play'}.svg`}
                         alt="play"/>
                </button>
                <CommentsSection podcast={previewedPodcast}/>
                {podcastURL && <div style={{height: '100px'}}/>}
            </div>
        </>
    )
}