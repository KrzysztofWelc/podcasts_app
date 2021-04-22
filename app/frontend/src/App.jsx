import React from 'react';
import {HashRouter as Router, Switch, Route} from "react-router-dom";
import {AuthProvider} from "./contexts/GlobalContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import PublishPodcast from "./pages/PublishPodcast";
import Profile from "./pages/profile/Profile";
import PlayerWrapper from "./logic/PlayerWrapper";
import Navbar from "./UI/Navbar";
import Search from "./pages/Search";

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar/>
                <div className="w-9/12 m-auto pb-32 pt-8 text-gray-800">
                    <Switch>
                        <Route path='/login' component={Login}/>
                        <Route path='/register' component={Register}/>
                        <Route path='/publish_podcast' component={PublishPodcast}/>
                        <Route path='/user/:id' component={Profile}/>
                        <Route path='/search/:query' component={Search}/>
                        <Route path='/' component={MainPage}/>
                    </Switch>
                </div>
                <PlayerWrapper />
            </Router>
        </AuthProvider>

    )
}