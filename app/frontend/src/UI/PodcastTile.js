import React from "react";
import {useAuth} from "../contexts/GlobalContext";
import {useHistory} from 'react-router-dom'

export default function PodcastTile({podcast}) {
    const {setGlobalPodcast, setPreviewedPodcast} = useAuth()
    const history = useHistory()


    function goToAuthorProfileHandler(e, author_id) {
        e.preventDefault()
        e.stopPropagation()
        history.push('/user/' + author_id)
    }

    return (
        <div onClick={() => setPreviewedPodcast(podcast)}
             className='border border-gray-300 rounded-md overflow-hidden w-64'>
            <img src={`${process.env.BASE_URL}api/podcasts/image/${podcast.cover_img}`} alt="Card image cap"/>
            <div className="p-3">
                <h5 className="text-4xl mb-2">{podcast.title}</h5>
                <p onClick={e=>goToAuthorProfileHandler(e, podcast.author.id)} className="mb-2 text-lg">{podcast.author.username}</p>
                <button onClick={(e) => setGlobalPodcast(podcast, e)}
                        className='rounded-md bg-blue-600 text-blue-50 px-3 py-1 '>
                    play
                </button>
            </div>
        </div>
    )
}