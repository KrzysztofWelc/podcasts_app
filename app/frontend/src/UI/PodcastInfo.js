import React, {useState, useEffect} from "react";
import {useAuth} from "../contexts/GlobalContext";
import Backdrop from "./Backdrop";
import CommentsSection from "./comments/CommentsSection";

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
            <div
                className='border-box max-h-7-10 z-40 pb-32 pt-4 px-6 overflow-y-auto fixed  inset-x-0 bottom-0 bg-gray-800 text-white'
            >
                <button
                    onClick={() => setPreviewedPodcast(null)}
                    className='border-0 bg-transparent absolute top-4 right-4 w-6'>
                    <img src={`${process.env.BASE_URL}assets/close.svg`} alt="iks"/>
                </button>
                <div className="flex-1">
                    <h2 className='font-bold text-4xl mb-4'>{previewedPodcast.title}</h2>
                    <button
                        onClick={(e) => setGlobalPodcast(previewedPodcast, e)}
                        className='mb-3 border-0 bg-transparent'>
                        <img className='h-6' src={`${process.env.BASE_URL}assets/${isPlayingLocal ? 'pause' : 'play'}.svg`}
                             alt="play"/>
                    </button>
                </div>

                <p className='text-xl'>{previewedPodcast.description}</p>
                <CommentsSection podcast={previewedPodcast}/>
                {podcastURL && <div className='h-28'/>}
            </div>
        </>
    )
}