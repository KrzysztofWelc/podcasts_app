import React from 'react';
import {HashRouter as Router, Switch, Route} from "react-router-dom";
import {AuthProvider} from "./contexts/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PublishPodcast from "./pages/PublishPodcast";
import Profile from "./pages/Profile";
import Navbar from "./UI/Navbar";
import PrivateRoute from "./logic/PrivateRoute";

export default function App() {
    return (
        <AuthProvider>
        <Router>
            <Navbar/>
            <div className="container">
                <Switch>
                    <Route path='/login' component={Login}/>
                    <Route path='/register' component={Register}/>
                    <Route path='/publish_podcast' component={PublishPodcast}/>
                    <Route path='/user/:id' component={Profile}/>
                    <Route path='/'><h2>hello</h2></Route>
                </Switch>
            </div>
        </Router>
        </AuthProvider>

    )
}