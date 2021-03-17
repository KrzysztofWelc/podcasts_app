import React from "react";
import {useAuth} from "../contexts/GlobalContext";

export default function PodcastTile({podcast}){
    const {setGlobalPodcast} = useAuth()

    return(
        <div onClick={()=>setGlobalPodcast(podcast)} className="card" style={{width: '18rem'}}>
            <img className="card-img-top" src={`/podcasts/image/${podcast.cover_img}`} alt="Card image cap"/>
                <div className="card-body">
                    <h5 className="card-title">{podcast.title}</h5>
                    <p className="card-text">{podcast.author.username}</p>
                </div>
        </div>
    )
}