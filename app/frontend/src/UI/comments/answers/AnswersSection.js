import React, {useState}from 'react'
import {useCookies} from "react-cookie";
import AnswerCommentForm from "./AnswerCommentForm";

export default function AnswerSection(){
    const [answers, serAnswers] = useState([])
    const [isAnswerFormVisible, setAnswerFormVisible] = useState(false)
    const cookies = useCookies()[0]

    return (
        <div className='pl-8'>
            {isAnswerFormVisible && <AnswerCommentForm/>}
        </div>
    )
}