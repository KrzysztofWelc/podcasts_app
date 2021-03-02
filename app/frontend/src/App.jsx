import React from 'react';
import {HashRouter as Router, Switch, Route} from "react-router-dom";
import {AuthProvider} from "./contexts/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./UI/Navbar";

export default function App() {
    return (
        <AuthProvider>
        <Router>
            <Navbar/>
            <div className="container">
                <Switch>
                    <Route path='/login'><Login/></Route>
                    <Route path='/register'><Register/></Route>
                    <Route path='/'><h1>home</h1></Route>
                </Switch>
            </div>
        </Router>
        </AuthProvider>

    )
}