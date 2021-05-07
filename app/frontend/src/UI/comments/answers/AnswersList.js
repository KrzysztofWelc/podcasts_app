import React, {useState} from 'react'
import {useAnswers} from "../../../contexts/AnswersContext";
import Answer from "./Answer";


export default function AnswersList({answers, isMore, fetchMoreAnswers}) {


    return (
        <div>
            <ul className='pl-8 mt-2'>
                {answers.length ? answers.map(a => <Answer key={a.id} data={a}/>) : null}
            </ul>
            {isMore && <button className='btn' onClick={()=>fetchMoreAnswers()}>więcej</button>}
        </div>

    )
}