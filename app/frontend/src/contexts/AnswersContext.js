import React, {useContext, useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useTranslation} from "react-i18next";
import axios from "../utils/axios";


const AnswersContext = React.createContext()

export function useAnswers() {
    return useContext(AnswersContext)
}

export function AnswersProvider({children, commentId, areAnswersVisible}) {
    const cookies = useCookies()[0]
    const [answers, setAnswers] = useState([])
    const [answersPage, setAnswersPage] = useState(0)
    const [isMore, setIsMore] = useState(true)
    const {t} = useTranslation()

    useEffect(() => {
        const fetchAnswers = async () => {
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

    function fetchMoreAnswers() {
        if (isMore) {
            setAnswersPage(answersPage + 1)
        }
    }

    function fetchFirstAnswers() {
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
            console.log(err)
            return t('error.general')
        }
    }

    useEffect(() => {
        if (areAnswersVisible && answersPage === 0) {
            fetchFirstAnswers()
        }
    }, [areAnswersVisible])


    const value = {answers, setAnswers, addAnswer, isMore, fetchMoreAnswers, fetchFirstAnswers}

    return (
        <AnswersContext.Provider value={value}>
            {children}
        </AnswersContext.Provider>
    )
}