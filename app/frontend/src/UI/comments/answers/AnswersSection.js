import React from 'react'
import AnswerCommentForm from "./AnswerCommentForm";
import {AnswersProvider} from "../../../contexts/AnswersContext";
import AnswersList from "./AnswersList";


export default function AnswerSection({commentId, isAnswerMode, areAnswersVisible}) {
    return (
        <AnswersProvider commentId={commentId}>
            {isAnswerMode && <AnswerCommentForm/>}
            {areAnswersVisible && <AnswersList/>}
        </AnswersProvider>
    )
}