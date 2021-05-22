import React from "react";
import { useTranslation } from 'react-i18next';
import PodcastTile from "../UI/PodcastTile";
import NonPaginatedList from "../logic/NonPaginatedList";
import PaginatedList from "../logic/PaginatedList";
import List from "../UI/List";


export default function MainPage() {
    const { t } = useTranslation();

    return (
        <div>
            <div className='mb-5'>
                <h2 className='font-semibold text-3xl mb-4'>{t('home.popular')}</h2>
                <NonPaginatedList
                    url={'api/podcasts/most_popular'}
                    render={({items, loading}) => <List items={items} loading={loading} isMore={false} Component={PodcastTile}/>}
                />
            </div>
            <div>
                <h2 className='font-semibold text-3xl my-4'>{t('home.newest')}</h2>
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