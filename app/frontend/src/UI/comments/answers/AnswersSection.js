import React, {useEffect, useState} from 'react'
import AnswerCommentForm from "./AnswerCommentForm";
import AnswersList from "./AnswersList";
import {AnswersProvider} from "../../../contexts/AnswersContext";


export default function AnswerSection({commentId, isAnswerMode, areAnswersVisible}) {

    return (
        <AnswersProvider commentId={commentId} areAnswersVisible={areAnswersVisible}>
            {isAnswerMode && <AnswerCommentForm/>}
            {areAnswersVisible && <AnswersList/>}
        </AnswersProvider>
    )
}