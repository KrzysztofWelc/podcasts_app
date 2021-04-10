import React, {useState, useEffect} from "react";
import {useParams} from 'react-router-dom'
import axios from "../utils/axios";
import PodcastTile from "../UI/PodcastTile";
import PaginatedList from "../logic/PaginatedList";

export default function Profile() {
    const {id} = useParams()
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
            async function fetchUser() {
                try {
                    setLoading(true)
                    const {data} = await axios.get(`/api/users/${id}/data`)
                    setUser(data)
                    setLoading(false)
                } catch (e) {
                    setError(e)
                }
            }

            fetchUser()
        }, [id]
    )

    return (
        <div>
            {user &&
            <div>
                <img src={`/api/users/avatar/${user.profile_img}`} alt=""/>
                <h2>{user.username}</h2>
            </div>}
            {error &&
            <div className="alert alert-danger" role="alert">
                something went wrong
            </div>}
            <PaginatedList
                url={`/api/podcasts/all/${id}/`}
                render={({items, isMore, loading, moreHandler}) => (
                    items.length ? <div
                        className='d-flex' style={{
                        overflowX: 'auto'
                    }}>

                        {items.map(podcast => <PodcastTile key={podcast.id} podcast={podcast}/>)}
                        {isMore && <button onClick={moreHandler}>more</button>}
                        {loading && <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>}
                    </div> : null
                )
                }
            />
        </div>
    )
}