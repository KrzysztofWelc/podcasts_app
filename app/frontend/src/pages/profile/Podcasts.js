import React from "react";
import {useParams} from "react-router-dom";
import PodcastTile from "../../UI/PodcastTile";
import PaginatedList from "../../logic/PaginatedList";
import List from "../../UI/List";

export default function Podcasts() {
    const {id} = useParams()

    return (
        <div>
            <PaginatedList
                url={`/api/podcasts/all/${id}/`}
                render={({items, isMore, loading, moreHandler}) => <List items={items} isMore={isMore} loading={loading}
                                                                         moreHandler={moreHandler} CRUDMode={true} Component={PodcastTile}/>
                }
            />
        </div>
    )
}