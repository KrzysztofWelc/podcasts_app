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
    const [answersPage, setAnswersPage] = useState(0)
    const [isMore, setIsMore] = useState(true)

    useState(() => {
        async function fetchAnswers() {
            if (answersPage) {
                const {data} = await axios.get(
                    `/api/comments/${commentId}/answers/${answersPage}`
                )
                setIsMore(data.is_more)
                const check = new Set()
                const a = [...answers, ...data.items].filter(answer => !check.has(answer.id) && check.add(answer.id))
                console.log(a)
                setAnswers(a)
            }
        }

        fetchAnswers()
    }, [answersPage])

    async function fetchMoreAnswers() {
        if (isMore) {
            setAnswersPage(answersPage + 1)
        }
    }

    function fetchFirstAnswers(){
        setAnswersPage(1)
    }

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

    const value = {answers, setAnswers, addAnswer, isMore, fetchMoreAnswers, fetchFirstAnswers}

    return (
        <AnswersContext.Provider value={value}>
            {children}
        </AnswersContext.Provider>
    )
}