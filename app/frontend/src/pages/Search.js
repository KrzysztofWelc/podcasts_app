import React from "react";
import {useParams} from 'react-router-dom'

import PodcastsList from "../logic/search/PodcastsList";
import UsersList from "../logic/search/UsersList";

export default function Search() {
    const {query} = useParams()


    return (<div>
        <PodcastsList query={query}/>
        <UsersList query={query}/>
    </div>)
}