import React from "react";
import {useAuth} from "../contexts/AuthContext";

export default function PodcastTile({audio_file, author, title, cover_img}){
    const {setGlobalPodcastURL} = useAuth()

    return(
        <div onClick={()=>setGlobalPodcastURL(audio_file)} className="card" style={{width: '18rem'}}>
            <img className="card-img-top" src={`/podcasts/image/${cover_img}`} alt="Card image cap"/>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{author.username}</p>
                </div>
        </div>
    )
}