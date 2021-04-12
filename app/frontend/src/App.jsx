import React from 'react';
import {HashRouter as Router, Switch, Route} from "react-router-dom";
import {AuthProvider} from "./contexts/GlobalContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PublishPodcast from "./pages/PublishPodcast";
import Profile from "./pages/profile/Profile";
import PlayerWrapper from "./logic/PlayerWrapper";
import Navbar from "./UI/Navbar";
import Search from "./pages/Search";
import PrivateRoute from "./logic/PrivateRoute";

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar/>
                <div className="container" style={{paddingTop: '5rem'}}>
                    <Switch>
                        <Route path='/login' component={Login}/>
                        <Route path='/register' component={Register}/>
                        <Route path='/publish_podcast' component={PublishPodcast}/>
                        <PrivateRoute path='/user/:id' component={Profile}/>
                        <Route path='/search/:query' component={Search}/>
                        <Route path='/'><h2>hello</h2></Route>
                    </Switch>
                </div>
                <PlayerWrapper />
            </Router>
        </AuthProvider>

    )
}