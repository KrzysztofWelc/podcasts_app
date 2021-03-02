import React, {useContext, useState} from "react";
import axios from "axios";
import {useCookies} from 'react-cookie'

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}


export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const [cookies, setCookie, removeCookie] = useCookies();

    const value = {
        currentUser,
        signUp
    }

    async function signUp(username, email, password, password2) {
        try {
            const res = await axios.post('/users/register', {
                email,
                username, password, password2
            })
            setCurrentUser(res.user)
            setCookie('authToken', res.token)
        } catch (e) {
            if(e.response){
                return e.response.data
            }else {
                return {server: ['error']}
            }
        }
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}