import React, {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import axios from "axios";
import AddCommentSection from "./AddCommentForm";
import CommentsList from "./CommentsList";

export default function CommentsSection({podcast}) {
    const [comments, setComments] = useState([])
    const [isMore, setIsMore] = useState(true)
    const [page, setPage] = useState(1)
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
            setComments([comment].concat(comments))
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                if (isMore) {
                    const response = await axios.get(`/comments/${podcast.id}/${page}`)
                    const {comments: rComs, is_more: rIsMore} = response.data;
                    setComments(comments.concat(rComs))
                    setIsMore(rIsMore)
                }
            } catch (e) {
                console.log(e)
            }
        }

        fetchComments()
    }, [page])

    function nextPageHandler() {
        setPage(page + 1)
    }

    return (
        <>
            <AddCommentSection addComment={addComment}/>
            <CommentsList comments={comments} nextPageHandler={nextPageHandler}/>
        </>
    )
}