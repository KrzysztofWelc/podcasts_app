import React from 'react'
import {Redirect, Route} from 'react-router-dom';
import {useCookies} from "react-cookie";

export default function PrivateRoute({component: Component, ...rest}) {
    const cookies = useCookies()[0]

    return (
        <Route
            {...rest}
            render={props => cookies.authToken ? <Component {...props} /> : <Redirect to='/login'/>}
        >
        </Route>
    )
}