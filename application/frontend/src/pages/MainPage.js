import React from "react";
import PodcastTile from "../UI/PodcastTile";
import NonPaginatedList from "../logic/NonPaginatedList";
import PaginatedList from "../logic/PaginatedList";


export default function MainPage() {
    return (
        <div>
            <div className='mb-5'>
                <h2>Popularne</h2>
                <NonPaginatedList
                    url={'api/podcasts/most_popular'}
                    render={({items, loading}) => (
                        items.length ? <div
                            className='d-flex' style={{
                            overflowX: 'auto'
                        }}>

                            {items.map(podcast => <PodcastTile key={podcast.id} podcast={podcast}/>)}
                            {loading && <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>}
                        </div> : null
                    )
                    }
                />
            </div>
            <div>
                <h2>Najnowsze</h2>
                <PaginatedList
                    url={'api/podcasts/newest/'}
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
        </div>
    )
}