import React, {useState, useEffect} from "react";
import {useParams, useRouteMatch, Switch, Route, Link} from 'react-router-dom'
import axios from "../../utils/axios";
import {useAuth} from "../../contexts/GlobalContext";
import Podcasts from "./Podcasts";
import EditData from "./EditData";
import PrivateRoute from "../../logic/routes/PrivateRoute";

export default function Profile() {
    const {id} = useParams()
    let {path, url} = useRouteMatch();
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const {currentUser} = useAuth()

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
                <img
                    className='w-52 h-52 rounded-full block mx-auto'
                    src={`${process.env.BASE_URL}api/users/avatar/${user.profile_img}`} alt="użytkownik"/>
                <h2 className='text-4xl text-center mb-3'>{user.username}</h2>
            </div>}

            {error &&
            <div className="alert-danger fixed bottom-6 left-1/2 transform -translate-x-2/4" role="alert">
                something went wrong
            </div>}


            {currentUser && currentUser.id == id && <nav>
                <ul className='border-b list-none w-2/6 mx-auto flex justify-around items-center'>
                    <li><Link className='text-2xl text-blue-400 hover:text-blue-500 cursor-pointer'
                              to={url}>podcasty</Link>
                    </li>
                    <li><Link className='text-2xl text-blue-400 hover:text-blue-500 cursor-pointer'
                              to={`${url}/edit_data`}>dane</Link></li>
                </ul>
            </nav>
            }

            <div className="my-8">
                <Switch>
                    <Route exact path={path} component={Podcasts}/>
                    <PrivateRoute condition={(user) => user && user.id == id} redirectURL={url} exact
                                  path={`${url}/edit_data`}
                                  component={EditData}/>
                </Switch>
            </div>

        </div>
    )
}