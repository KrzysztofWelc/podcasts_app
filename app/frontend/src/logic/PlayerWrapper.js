import React from "react";
import {useAuth} from "../contexts/AuthContext";
import Player from "../UI/Player";

export default function PlayerWrapper(){
    const {podcastURL} = useAuth()

    return podcastURL ? <Player podcastURL={podcastURL}/> : null
}