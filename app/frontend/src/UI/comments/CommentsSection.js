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

    async function editCommentHandler(text, commentId) {
        try {
            const {data: comment} = await axios.put(
                '/comments',
                {
                    text,
                    comment_id: commentId
                },
                {
                    headers: {
                        auth_token: `Bearer: ${cookies.authToken}`
                    }
                })
            const updatedComments = [...comments].map(c => {
                if (c.id == commentId) {
                    return comment
                } else {
                    return c
                }
            })
            setComments(updatedComments)
        } catch (e) {
            console.log(e)
        }
    }

    async function deleteCommentHandler(commentId) {
        try {
            await axios.delete(
                '/comments',
                {
                    data: {
                        comment_id: commentId
                    },
                    headers: {
                        auth_token: `Bearer: ${cookies.authToken}`
                    }
                })
            const updatedComments = [...comments].filter(c => c.id !== commentId)
            setComments(updatedComments)
        } catch (e) {
            console.log(e.response)
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
            <CommentsList
                isMore={isMore}
                comments={comments}
                nextPageHandler={nextPageHandler}
                editCommentHandler={editCommentHandler}
                deleteCommentHandler={deleteCommentHandler}
            />
        </>
    )
}