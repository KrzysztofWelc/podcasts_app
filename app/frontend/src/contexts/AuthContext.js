import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from 'react-cookie'
import Loader from "../UI/Loader";

//TODO: chnge file name to GlobalContext

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}


export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies(/*['authToken']*/);
    const [podcastURL, setPodcastURL] = useState("")

    const value = {
        currentUser, podcastURL,
        signUp, logIn, logOut,
        setGlobalPodcastURL
    }

    function setGlobalPodcastURL(filename){
        setPodcastURL(`/podcasts/stream/${filename}`)
    }

    async function logIn(email, password) {
        setLoading(true)
        try {
            const res = await axios.post('/users/login', {
                email, password
            })
            setCurrentUser(res.data.user)
            setCookie('authToken', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
        } catch (e) {
            if (e.response) {
                return e.response.data
            } else {
                return {server: ['error']}
            }
        }
        setLoading(false)
    }

    async function signUp(username, email, password, password2) {
        setLoading(true)
        try {
            const res = await axios.post('/users/register', {
                email,
                username, password, password2
            })
            console.log(res)
            setCurrentUser(res.data.user)
            setCookie('authToken', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
        } catch (e) {
            if (e.response) {
                return e.response.data
            } else {
                return {server: ['error']}
            }
        }
        setLoading(false)
    }

    async function logOut(){
        setLoading(true)
        try {
            await axios.post('/users/logout', {}, {headers: {auth_token: `Bearer ${cookies.authToken}`}})
            removeCookie('authToken')
            localStorage.removeItem('user')
            setCurrentUser(null)
        }catch (e){
            console.log(e.response)
        }
        setLoading(false)
    }

    useEffect(()=>{
        if(cookies.authToken){
            const user = localStorage.getItem('user')
            if(user){
                setCurrentUser(JSON.parse(user))
            }
        }
    },[])

    return (
        <AuthContext.Provider value={value}>
            {loading ? <Loader/> : children}
        </AuthContext.Provider>
    )
}