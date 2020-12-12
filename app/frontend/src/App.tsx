import React from 'react';
import {HashRouter as Router, Switch, Route, Link} from "react-router-dom";

export default function App()
{
    return (
        <Router>
            <ul>
                <li><Link to='/login'>login</Link></li>
                <li><Link to='/register'>register</Link></li>
                <li><Link to='/'>home</Link></li>
            </ul>
            <Switch>
                <Route path='/login'><h1>login</h1></Route>
                <Route path='/register'><h1>register</h1></Route>
                <Route path='/'><h1>home</h1></Route>
            </Switch>
        </Router>
    )
}