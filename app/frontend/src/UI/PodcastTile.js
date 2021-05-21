import React, {useState} from "react";
import {useAuth} from "../contexts/GlobalContext";
import {useHistory} from 'react-router-dom'
import Backdrop from "./Backdrop";
import DeleteForm from "./DeleteForm";
import EditPodcastForm from "./EditPodcastForm";

export default function PodcastTile({data, CRUDMode}) {
    const {setGlobalPodcast, setPreviewedPodcast, currentUser} = useAuth()
    const history = useHistory()
    const [isDeleteFormVisible, setIsDeleteFormVisible] = useState(false)
    const [isEditFormVisible, setIsEditFormVisible] = useState(false)

    function goToAuthorProfileHandler(e, author_id) {
        e.preventDefault()
        e.stopPropagation()
        history.push('/user/' + author_id)
    }

    function showDeleteFormHandler(e) {
        e.stopPropagation()
        setIsDeleteFormVisible(true)
    }

    function showEditFormHandler(e) {
        e.stopPropagation()
        setIsEditFormVisible(true)
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
                <p onClick={e => goToAuthorProfileHandler(e, data.author.id)}
                   className="mb-2 text-lg">{data.author.username}</p>
                <button onClick={(e) => setGlobalPodcast(data, e)}
                        className='btn'>
                    play
                </button>
                {CRUDMode && currentUser && currentUser.id == data.author.id && <>
                    <button className='btn' onClick={showEditFormHandler}>edit</button>
                    <button className='btn-danger' onClick={showDeleteFormHandler}>delete</button>
                </>}
            </div>
            {isDeleteFormVisible && <Backdrop clickAction={(e)=> {
                e.stopPropagation()
                setIsDeleteFormVisible(false)
            }}><DeleteForm cancelHAndler={()=>setIsDeleteFormVisible(false)} podcast={data}/></Backdrop>}

            {isEditFormVisible && <Backdrop clickAction={(e)=> {
                e.stopPropagation()
                setIsEditFormVisible(false)
            }}><EditPodcastForm cancelHAndler={()=>setIsEditFormVisible(false)} podcast={data}/></Backdrop>}
        </div>
    )
}