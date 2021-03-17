import React from "react";
import {useAuth} from "../contexts/GlobalContext";
import Backdrop from "./Backdrop";

const style = {
    boxSizing: "border-box",
    width: '100vw',
    zIndex: 100,
    bottom: '0px',
    padding: '1rem',
    paddingBottom: '90px'

}
export default function PodcastInfo({podcast}) {
    const {setPreviewedPodcast} = useAuth()

    return (
        <Backdrop clickAction={() => setPreviewedPodcast(null)}>
            <div className='position-fixed bg-dark text-light ' style={style}>
                <h2>{podcast.title}</h2>
                <p>{podcast.description}</p>
            </div>
        </Backdrop>
    )
}