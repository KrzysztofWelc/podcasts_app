import React from "react";
import PodcastTile from "../UI/PodcastTile";
import NonPaginatedList from "../logic/NonPaginatedList";
import PaginatedList from "../logic/PaginatedList";
import List from "../UI/List";


export default function MainPage() {
    return (
        <div>
            <div className='mb-5'>
                <h2>Popularne</h2>
                <NonPaginatedList
                    url={'api/podcasts/most_popular'}
                    render={({items, loading}) => <List items={items} loading={loading} isMore={false} Component={PodcastTile}/>}
                />
            </div>
            <div>
                <h2>Najnowsze</h2>
                <PaginatedList
                    url={'api/podcasts/newest/'}
                    render={({items, isMore, loading, moreHandler}) => <List items={items} isMore={isMore}
                                                                             loading={loading}
                                                                             moreHandler={moreHandler} Component={PodcastTile}/>
                    }
                />
            </div>
        </div>
    )
}