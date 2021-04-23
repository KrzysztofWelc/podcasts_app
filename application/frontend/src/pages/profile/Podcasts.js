import React from "react";
import {useParams} from "react-router-dom";
import PodcastTile from "../../UI/PodcastTile";
import PaginatedList from "../../logic/PaginatedList";

export default function Podcasts() {
    const {id} = useParams()

    return (
        <div>
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