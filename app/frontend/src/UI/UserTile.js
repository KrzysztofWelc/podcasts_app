import React from "react";
import {Link} from "react-router-dom";

export default function UserTile({user}) {

    return (
        <Link to={'/user/' + user.id}>
            <div className="card" style={{minWidth: '18rem'}}>
                <img className="card-img-top" src={`/api/users/avatar/${user.profile_img}`} alt="Card image cap"/>
                <div className="card-body">
                    <h5 className="card-title">{user.username}</h5>
                </div>
            </div>
        </Link>

    )
}