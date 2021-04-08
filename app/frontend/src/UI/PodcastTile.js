import React from "react";
import {useAuth} from "../contexts/GlobalContext";

export default function PodcastTile({podcast}){
    const {setGlobalPodcast, setPreviewedPodcast} = useAuth()

    return(
        <div onClick={()=>setPreviewedPodcast(podcast)}  className="card" style={{minWidth: '18rem'}}>
            <img className="card-img-top" src={`/api/podcasts/image/${podcast.cover_img}`} alt="Card image cap"/>
                <div className="card-body">
                    <h5 className="card-title">{podcast.title}</h5>
                    <p className="card-text">{podcast.author.username}</p>
                    <button onClick={(e)=>setGlobalPodcast(podcast, e)} className='btn btn-primary'>play</button>
                </div>
        </div>
    )
}