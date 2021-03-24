import React, {useState, useEffect} from "react";
import axios from "axios";
import {useParams} from 'react-router-dom'
import PodcastTile from "../UI/PodcastTile";

export default function Profile() {
    const {id} = useParams()
    const [podcasts, setPodcasts] = useState([])
    const [page, setPage] = useState(1)

    useEffect(() => {
        const fetchPodcasts = async () => {
            try {
                const response = await axios.get(`/podcasts/all/${id}/${page}`)
                const p = response.data.podcasts
                setPodcasts(p)
            } catch (e) {
                console.log(e)
            }
        }

        fetchPodcasts()
    }, [])

    return (<div>

        <h2>user {id}
        </h2>
        <div className="d-flex">
            {podcasts.map(podcast => <PodcastTile
                key={podcast.id}
                podcast={podcast}
                // audio_file={podcasts.audio_file}
                // title={podcasts.title}
                // cover_img={podcasts.cover_img}
                // author={podcasts.author}
            />)}
        </div>

    </div>)
}