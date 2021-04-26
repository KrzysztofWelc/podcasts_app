import React from "react";
import {useParams} from 'react-router-dom'
import PaginatedList from "../logic/PaginatedList";
import PodcastTile from "../UI/PodcastTile";
import UserTile from "../UI/UserTile";
import List from "../UI/List";

export default function Search() {
    const {query} = useParams()


    return (<div>
        <PaginatedList
            url={`/api/search/podcasts/${query}/`}
            render={({items, isMore, loading, moreHandler}) => <List items={items} isMore={isMore} loading={loading}
                                                                     moreHandler={moreHandler} Component={PodcastTile}/>
            }
        />

        <PaginatedList
            url={`/api/search/users/${query}/`}
            render={({items, isMore, loading, moreHandler}) => <List items={items} isMore={isMore} loading={loading}
                                                                     moreHandler={moreHandler} Component={UserTile}/>}/>
    </div>)
}