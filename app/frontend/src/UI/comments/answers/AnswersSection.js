import React, {useEffect, useState} from 'react'
import AnswerCommentForm from "./AnswerCommentForm";
import AnswersList from "./AnswersList";
import {useCookies} from "react-cookie";
import axios from "../../../utils/axios";


export default function AnswerSection({commentId, isAnswerMode, areAnswersVisible}) {
    const cookies = useCookies()[0]
    const [answers, setAnswers] = useState([])
    const [answersPage, setAnswersPage] = useState(0)
    const [isMore, setIsMore] = useState(true)

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
            return 'coś poszło nie tak'
        }
    }

    useEffect(() => {
        if (areAnswersVisible && answersPage === 0) {
            fetchFirstAnswers()
        }
    }, [areAnswersVisible])

    return (
        <div>
            {isAnswerMode && <AnswerCommentForm addAnswer={addAnswer}/>}
            {areAnswersVisible && <AnswersList
                answers={answers}
                isMore={isMore}
                fetchFirstAnswers={fetchFirstAnswers}
                fetchMoreAnswers={fetchMoreAnswers}
            />}
        </div>
    )
}