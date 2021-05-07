import React, {useContext, useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import axios from "../utils/axios";


const AnswersContext = React.createContext()

export function useAnswers() {
    return useContext(AnswersContext)
}

export function AnswersProvider({children, commentId}) {
    const cookies = useCookies()[0]
    const [answers, setAnswers] = useState([])

    async function addAnswer(text) {
        try {
            const {data} = await axios.post(
                `/api/comments/${commentId}/answer`,
                {
                    text
                },
                {
                    headers: {
                        authToken: `Bearer: ${cookies.authToken}`
                    }
                }
            )
            setAnswers([data].concat(answers))
            return null
        } catch (err) {
            return 'coś poszło nie tak'
        }
    }

    const value = {answers, setAnswers, addAnswer}

    return (
        <AnswersContext.Provider value={value}>
            {children}
        </AnswersContext.Provider>
    )
}