import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from 'react-cookie'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}


export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [cookies, setCookie, removeCookie] = useCookies(['authToken']);

    const value = {
        currentUser,
        signUp, logIn
    }

    async function logIn(email, password) {
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
    }

    async function signUp(username, email, password, password2) {
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
    }

    useEffect(()=>{
        if(cookies.authToken){
            const user = localStorage.getItem('user')
            if(user){
                setCurrentUser(user)
            }
        }
    },[])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}