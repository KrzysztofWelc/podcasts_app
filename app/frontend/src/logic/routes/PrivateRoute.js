import React from 'react'
import {Redirect, Route} from 'react-router-dom';
import {useAuth} from "../../contexts/GlobalContext";

export default function PrivateRoute({component: Component, condition, redirectURL, ...rest}) {
    const {currentUser} =  useAuth()

    return (
        <Route
            {...rest}
            render={props => condition(currentUser) ? <Component {...props} /> : <Redirect to={redirectURL}/>}
        >
        </Route>
    )
}