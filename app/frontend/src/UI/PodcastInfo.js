import React from "react";
import Backdrop from "./Backdrop";

const style = {
    boxSizing: "border-box",
    width: '100wv',
    zIndex: 100

}
export default function PodcastInfo({podcast}){
    return(<div className='position-fixed bg-dark text-light p-3' style={style}>
        <h2>{podcast.title}</h2>
        <p>{podcast.description}</p>
    </div>)
}