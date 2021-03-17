import React from "react";
import {useAuth} from "../contexts/GlobalContext";
import Player from "../UI/Player";
import PodcastInfo from "../UI/PodcastInfo";


export default function PlayerWrapper() {
    const {
        podcastURL,
        previewedPodcast
    } = useAuth()

    return (
        <>
            {previewedPodcast ? <PodcastInfo/> : null}

            {podcastURL ? <Player/> : null}
        </>
    )
}