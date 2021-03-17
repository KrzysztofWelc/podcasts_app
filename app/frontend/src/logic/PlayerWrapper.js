import React from "react";
import {useAuth} from "../contexts/GlobalContext";
import Player from "../UI/Player";

export default function PlayerWrapper() {
    const {podcastURL, previewedPodcast} = useAuth()

    return (
            podcastURL ? <Player podcastURL={podcastURL}/> : null
    )
}