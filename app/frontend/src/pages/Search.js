import React from "react";
import {useParams} from 'react-router-dom'
import PaginatedList from "../logic/PaginatedList";
import PodcastTile from "../UI/PodcastTile";
import UserTile from "../UI/UserTile";

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
                    overflowX: 'auto',
                    marginTop: '1.5rem'
                }}>

                    {items.map(user => <UserTile key={user.id} user={user}/>)}
                    {isMore && <button onClick={moreHandler}>more</button>}
                    {loading && <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>}
                </div> : null
            )}/>
    </div>)
}