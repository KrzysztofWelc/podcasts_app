import React, {useState, useEffect} from "react";
import {useParams, useRouteMatch, Switch, Route, Link} from 'react-router-dom'
import axios from "../../utils/axios";
import Podcasts from "./Podcasts";
import EditData from "./EditData";

export default function Profile() {
    const {id} = useParams()
    let { path, url } = useRouteMatch();
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
            async function fetchUser() {
                try {
                    setLoading(true)
                    const {data} = await axios.get(`/api/users/${id}/data`)
                    setUser(data)
                    setLoading(false)
                } catch (e) {
                    setError(e)
                }
            }

            fetchUser()
        }, [id]
    )

    return (
        <div>
            {user &&
            <div>
                <img src={`/api/users/avatar/${user.profile_img}`} alt=""/>
                <h2>{user.username}</h2>
            </div>}
            {error &&
            <div className="alert alert-danger" role="alert">
                something went wrong
            </div>}
            <nav>
                <ul>
                    <li><Link to={url}>podcasty</Link></li>
                    <li><Link to={`${url}/edit_data`}>dane</Link></li>
                </ul>
            </nav>
            <Switch>
                <Route exact path={path} component={Podcasts} />
                <Route exact path={`${url}/edit_data`} component={EditData} />
            </Switch>
        </div>
    )
}