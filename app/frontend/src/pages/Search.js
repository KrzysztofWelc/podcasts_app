import React from "react";
import {useParams} from 'react-router-dom'
import PaginatedList from "../logic/PaginatedList";
import PodcastTile from "../UI/PodcastTile";

export default function Search() {
    const {query} = useParams()


    return (<div>
        <PaginatedList
            url={`/api/search/podcasts/${query}/`}
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

        <PaginatedList
            url={`/api/search/users/${query}/`}
            render={({items, isMore, loading, moreHandler}) => (
                items.length ? <div
                    className='d-flex' style={{
                    overflowX: 'auto'
                }}>

                    {items.map(user => <div key={user.id}>{user.username}</div>)}
                    {isMore && <button onClick={moreHandler}>more</button>}
                    {loading && <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>}
                </div> : null
            )}/>
    </div>)
}