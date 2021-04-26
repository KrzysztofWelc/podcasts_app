import React, {useContext, useEffect, useState} from "react";
import axios from "../utils/axios";
import {useCookies} from 'react-cookie'
import Loader from "../UI/Loader";


const GlobalContext = React.createContext()

export function useAuth() {
    return useContext(GlobalContext)
}


export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)
    const [loading, setLoading] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies(/*['authToken']*/);
    const [podcastURL, setPodcastURL] = useState("")
    const [currentPodcast, setCurrentPodcast] = useState(null)
    const [previewedPodcast, setPreviewedPodcast] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)


    const value = {
        currentUser,
        signUp, logIn, logOut,
        setGlobalPodcast, podcastURL, currentPodcast,
        previewedPodcast, setPreviewedPodcast,
        isPlaying, setIsPlaying
    }

    //use this to start playing a podcast
    function setGlobalPodcast(podcast, event) {
        event.stopPropagation()
        if (podcastURL == `${process.env.BASE_URL}api/podcasts/stream/${podcast.audio_file}`) {
            setIsPlaying(!isPlaying)
        } else {
            if (isPlaying) {
                setIsPlaying(false)
            }
            setPodcastURL(`${process.env.BASE_URL}api/podcasts/stream/${podcast.audio_file}`)
            setCurrentPodcast(podcast)
        }


    }

    async function logIn(email, password) {
        setLoading(true)
        try {
            const res = await axios.post('/api/users/login', {
                email, password
            })
            setCurrentUser(res.data.user)
            setCookie('authToken', res.data.token, {sameSite: true})
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

    async function signUp(username, email, password, password2, file) {
        let data = new FormData()

        if (file) {
            data.append('profile_img', file)
        }
        data.append('username', username)
        data.append('email', email)
        data.append('password', password)
        data.append('password2', password2)
        setLoading(true)
        try {
            const res = await axios.post('/api/users/register', data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            })
            console.log(res)
            setCurrentUser(res.data.user)
            setCookie('authToken', res.data.token, {sameSite: true})
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

    async function logOut() {
        setLoading(true)
        try {
            await axios.post('/api/users/logout', {}, {headers: {authToken: `Bearer ${cookies.authToken}`}})
            removeCookie('authToken')
            localStorage.removeItem('user')
            setCurrentUser(null)
        } catch (e) {
            console.log(e.response)
        }
        setLoading(false)
    }

    return (
        <GlobalContext.Provider value={value}>
            {loading ? <Loader/> : children}
        </GlobalContext.Provider>
    )
}