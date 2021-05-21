import React, {useEffect} from "react";
import {useAuth} from "../contexts/GlobalContext";
import Player from "../UI/Player";
import PodcastInfo from "../UI/PodcastInfo";


export default function PlayerWrapper() {
    const {
        podcastURL,
        previewedPodcast,
        setGlobalPodcast
    } = useAuth()

    useEffect(()=>{
        if(localStorage.getItem('podcast')){
            const podcast = JSON.parse(localStorage.getItem('podcast'))
            const time = localStorage.getItem('podcast_time') ? JSON.parse(localStorage.getItem('podcast_time')) : null
            setGlobalPodcast(podcast, null, time)
        }

    }, [])

    return (
        <>
            {previewedPodcast ? <PodcastInfo/> : null}

            {podcastURL ? <Player/> : null}
        </>
    )
}