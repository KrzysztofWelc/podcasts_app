import React from "react";
import Backdrop from "./Backdrop";

export default function Loader(){
    return(
        <Backdrop>
            <div className="spinner"/>
        </Backdrop>
    )
}