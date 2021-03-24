import React, {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import axios from "axios";
import AddCommentSection from "./AddCommentForm";
import CommentsList from "./CommentsList";

export default function CommentsSection({podcast}) {
    const [comments, setComments] = useState([])
    const cookies = useCookies()[0]

    async function addComment(text) {
        try {
            const {data: comment} = await axios.post(
                '/comments',
                {
                    text,
                    podcast_id: podcast.id
                },
                {
                    headers: {
                        auth_token: `Bearer: ${cookies.authToken}`
                    }
                })
            setComments(comments.concat([comment]))
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <AddCommentSection addComment={addComment}/>
            <CommentsList comments={comments}/>
        </>
    )
}