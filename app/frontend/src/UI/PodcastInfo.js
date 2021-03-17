import React from "react";
import Backdrop from "./Backdrop";

const style = {
    boxSizing: "border-box",
    width: '100vw',
    zIndex: 100,
    bottom: '0px',
    padding: '1rem',
    paddingBottom: '90px'

}
export default function PodcastInfo({podcast}){
    return(<div className='position-fixed bg-dark text-light ' style={style}>
        <h2>{podcast.title}</h2>
        <p>{podcast.description}</p>
    </div>)
}