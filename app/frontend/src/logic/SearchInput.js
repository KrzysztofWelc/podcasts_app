import React, {useState, useEffect} from "react";
import {useHistory, Link} from 'react-router-dom'
import {useTranslation} from "react-i18next";
import axios from "../utils/axios";
import {useAuth} from "../contexts/GlobalContext";

export default function SearchInput({setIsNavbarActive}) {
    const [query, setQuery] = useState('')
    const [isPreviewVisible, setIsPreviewVisible] = useState(false)
    const [previewLists, setPreviewLists] = useState({users: [], podcasts: []})
    const {t} = useTranslation()
    const history = useHistory()
    const {setPreviewedPodcast} = useAuth()

    useEffect(() => {
        async function getResults() {
            if (query) {
                const {data} = await axios.get(`/api/search/preview/${query}`)
                setPreviewLists(data)
            } else {
                setPreviewLists({users: [], podcasts: []})
            }
        }

        getResults()
    }, [query])

    function submitHandler(e) {
        e.preventDefault()
        if (query !== '') {
            setIsNavbarActive(false)
            history.push('/search/' + query)
        }
    }

    return (
        <form className='relative' onSubmit={submitHandler}>
            <input value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   onFocus={() => setIsPreviewVisible(true)}
                   onBlur={() => setTimeout(() => setIsPreviewVisible(false), 300)}
                   className="p-2 rounded-l-md text-grey-400 w-40"
                   type="search"
                   placeholder={t('navbar.search_placeholder')}
                   aria-label="Search"/>
            <button className="p-2 rounded-r-md text-white bg-purple-600 " type="submit">{t('navbar.search_button')}</button>
            {((previewLists.users.length || previewLists.podcasts.length) && isPreviewVisible) ? (
                <div
                    className='bg-white border-l border-r border-b rounded-b-lg border-blue-500 p-3 absolute w-full'
                    style={{
                        bottom: '-250%'
                    }}
                >
                    {previewLists.podcasts.length ? (
                        <div>
                            <h4 className='text-xl my-3'>podcasts</h4>
                            <ul className="list-none">
                                {previewLists.podcasts.length ? previewLists.podcasts.map(podcast => (
                                    <li key={podcast.id + 'podcast'}
                                        onClick={() => {
                                            setIsNavbarActive(false)
                                            setPreviewedPodcast(podcast)
                                        }}
                                        className="text-blue-500 text-lg cursor-pointer">{podcast.title}</li>
                                )) : null}
                            </ul>
                        </div>) : null}


                    {previewLists.users.length ? (
                        <div>
                            <h4 className='text-xl my-3'>users</h4>
                            <ul className="list-none">
                                {previewLists.users.length ? previewLists.users.map(user => (
                                    <Link onClick={()=>setIsNavbarActive(false)} key={user.id + 'user'} to={`/user/${user.id}`}>
                                        <li className="text-blue-500 text-lg ">{user.username}</li>
                                    </Link>)) : null}
                            </ul>
                        </div>) : null}
                </div>
            ) : null}

        </form>
    )
}