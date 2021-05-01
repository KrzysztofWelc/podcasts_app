import React from "react";
import {useAuth} from "../contexts/GlobalContext";
import {useHistory} from 'react-router-dom'

export default function PodcastTile({data}) {
    const {setGlobalPodcast, setPreviewedPodcast} = useAuth()
    const history = useHistory()


    function goToAuthorProfileHandler(e, author_id) {
        e.preventDefault()
        e.stopPropagation()
        history.push('/user/' + author_id)
    }

    return (
        <div onClick={() => setPreviewedPodcast(data)}
             className='card w-64 mr-2'
            style={{minWidth: '16rem'}}
            >
            <img
                className='w-full object-cover'
                src={`${process.env.BASE_URL}api/podcasts/image/${data.cover_img}`} alt="Card image cap"/>
            <div className="p-3">
                <h5 className="text-2xl md:text-4xl mb-2">{data.title}</h5>
                <p onClick={e=>goToAuthorProfileHandler(e, data.author.id)} className="mb-2 text-lg">{data.author.username}</p>
                <button onClick={(e) => setGlobalPodcast(data, e)}
                        className='rounded-md bg-blue-600 text-blue-50 px-3 py-1 '>
                    play
                </button>
            </div>
        </div>
    )
}