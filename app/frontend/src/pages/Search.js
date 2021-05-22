import React from "react";
import {useParams} from 'react-router-dom'
import {useTranslation} from "react-i18next";
import PaginatedList from "../logic/PaginatedList";
import PodcastTile from "../UI/PodcastTile";
import UserTile from "../UI/UserTile";
import List from "../UI/List";

export default function Search() {
    const {query} = useParams()
    const {t} = useTranslation()


    return (<div>
        <h2 className='font-semibold text-3xl mt-4'>{t('podcasts')}</h2>
        <PaginatedList
            url={`/api/search/podcasts/${query}/`}
            render={({items, isMore, loading, moreHandler}) => <List items={items} isMore={isMore} loading={loading}
                                                                     moreHandler={moreHandler} Component={PodcastTile}/>
            }
        />

        <h2 className='font-semibold text-3xl mt-4'>{t('users')}</h2>
        <PaginatedList
            url={`/api/search/users/${query}/`}
            render={({items, isMore, loading, moreHandler}) => <List items={items} isMore={isMore} loading={loading}
                                                                     moreHandler={moreHandler} Component={UserTile}/>}/>
    </div>)
}