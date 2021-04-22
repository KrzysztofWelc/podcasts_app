import React from "react";
import ChangePassword from "./editData/ChangePassword";
import ChangeAvatar from "./editData/ChangeAvatar";

export default function EditData(){
    return(
        <div>
            <ChangePassword/>
            <ChangeAvatar/>
        </div>
    )
}