import React, {useState, useEffect} from "react";
import PodcastTile from "../../UI/PodcastTile";
import axios from "../../utils/axios";

export default function PodcastsList({query}) {

    const [podcasts, setPodcasts] = useState([])
    const [podcastsPage, setPodcastsPage] = useState(1)
    const [isMorePodcasts, setIsMorePodcasts] = useState(false)
    const [podcastsLoading, setPodcastsLoading] = useState(true)


    useEffect(() => {
        async function fetchPodcasts() {
            const {data} = await axios.get(`/api/search/podcasts/${query}/1`)
            setPodcasts(data.podcasts)
            setIsMorePodcasts(data.is_more)
            setPodcastsLoading(false)
        }
        fetchPodcasts()
    }, [query])

    useEffect(() => {
        async function fetchPodcasts() {
            const {data} = await axios.get(`/api/search/podcasts/${query}/${podcastsPage}`)
            setPodcasts(podcasts.concat(data.podcasts))
            setIsMorePodcasts(data.is_more)
            setPodcastsLoading(false)
        }
        fetchPodcasts()
    }, [podcastsPage])

    function morePodcastsHandler(e) {
        e.preventDefault()
        setPodcastsLoading(true)
        setPodcastsPage(podcastsPage + 1)
    }

    return (
        podcasts.length ? <div
            className='d-flex' style={{
            overflowX: 'auto'
        }}>

            {podcasts.map(podcast => <PodcastTile key={podcast.id} podcast={podcast}/>)}
            {isMorePodcasts && <button onClick={morePodcastsHandler}>more</button>}
            {podcastsLoading && <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>}
        </div> : null
    )
}