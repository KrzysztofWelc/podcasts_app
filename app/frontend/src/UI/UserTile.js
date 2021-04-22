import React from "react";
import {Link} from "react-router-dom";

export default function UserTile({user}) {

    return (
        <Link to={'/user/' + user.id}>
            <div className="border border-gray-300 rounded-md overflow-hidden w-64" style={{minWidth: '18rem'}}>
                <img className="card-img-top" src={`/api/users/avatar/${user.profile_img}`} alt="Card image cap"/>
                <div className="p-3">
                    <h5 className="text-4xl mb-2">{user.username}</h5>
                </div>
            </div>
        </Link>

    )
}