import React, {useState} from "react";
import {Link} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext";
import {useHistory} from 'react-router-dom'


export default function Navbar() {
    const {currentUser, logOut} = useAuth()
    const history = useHistory()

    async function handleLogout(){
        await logOut()
        history.push('/')
    }


    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <a className="navbar-brand" href="#">Navbar</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    {currentUser ? <>
                        <li className="nav-item active">
                            <Link className="nav-link" to="#">Home</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="#">{currentUser.username}</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/publish_podcast">Publish</Link>
                        </li>
                        <li className="nav-item active">
                            <button onClick={handleLogout} className="nav-link btn" to="#">Log out</button>
                        </li>
                    </> : <>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/register">Register</Link>
                        </li>
                        <li className="nav-item active">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                    </>}
                </ul>
            </div>
        </nav>
    )
}