import React from "react";
import {useParams} from 'react-router-dom'

import PodcastsList from "../logic/search/PodcastsList";

export default function Search() {
    const {query} = useParams()


    return (<div>
        <PodcastsList query={query}/>
    </div>)
}