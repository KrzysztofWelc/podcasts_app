import React, {useState, useEffect} from "react";
import {useParams} from 'react-router-dom'
import axios from "../utils/axios";
import PodcastTile from "../UI/PodcastTile";

//todo finish this component
//todo use useeffect to refetch data on param change
export default function Search(){
    const {query} = useParams()
    const [users, setUsers] = useState([])
    const [podcasts, setPodcasts] = useState([])
    const [usersPage, setUsersPage] = useState(1)
    const [podcastsPage, setPodcastsPage] = useState(1)
    const [isMorePodcasts, setIsMorePodcasts] = useState(false)
    const [isMoreUsers, setIsMoreUsers] = useState(false)

    console.log(query)

    useEffect(()=>{
        axios.get(`/api/search/users/${query}/${usersPage}`)
            .then(({data})=>{
                console.log(data)
                setUsers(data.users)
                setIsMoreUsers(data.is_more)
            })
        axios.get(`/api/search/podcasts/${query}/${podcastsPage}`)
            .then(({data})=>{
                console.log(data)
                setPodcasts(data.podcasts)
                setIsMorePodcasts(data.is_more)
            })
    }, [])


    return(<div>
        {users.length ? <ul>{users.map(user=><li key={user.id}>{user.username}</li>)}</ul> : null}
        {podcasts.length ? <div
            className='d-flex' style={{
                overflowX: 'auto'
            }}>

            {podcasts.map(podcast=><PodcastTile key={podcast.id} podcast={podcast}/>)}
        </div> : null}
    </div>)
}