import React from 'react';
import {HashRouter as Router, Switch, Route, Link} from "react-router-dom";
import {AuthProvider} from "./contexts/AuthContext";
import Register from "./pages/Register";


export default function App() {
    return (
        <AuthProvider>
        <Router>
            <ul>
                <li><Link to='/login'>login</Link></li>
                <li><Link to='/register'>register</Link></li>
                <li><Link to='/'>home</Link></li>
            </ul>
            <div className="container">
                <Switch>
                    <Route path='/login'><h1>login</h1></Route>
                    <Route path='/register'><Register/></Route>
                    <Route path='/'><h1>home</h1></Route>
                </Switch>
            </div>
        </Router>
        </AuthProvider>

    )
}