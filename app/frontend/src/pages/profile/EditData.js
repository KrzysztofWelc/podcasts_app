import React from "react";
import ChangePassword from "./editData/ChangePassword";
import ChangeAvatar from "./editData/ChangeAvatar";
import ChangeBio from "./editData/ChangeBio";

export default function EditData(){
    return(
        <div>
            <ChangeBio/>
            <ChangeAvatar/>
            <ChangePassword/>
        </div>
    )
}