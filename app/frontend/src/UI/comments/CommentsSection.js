import React, {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import axios from "../../utils/axios";
import {useAuth} from "../../contexts/GlobalContext";
import AddCommentSection from "./AddCommentForm";
import CommentsList from "./CommentsList";

export default function CommentsSection({podcast}) {
    const [comments, setComments] = useState([])
    const [isMore, setIsMore] = useState(true)
    const [page, setPage] = useState(1)
    const {currentUser} = useAuth()
    const cookies = useCookies()[0]

    async function addComment(text) {
        try {
            const {data: comment} = await axios.post(
                '/api/comments',
                {
                    text,
                    podcast_id: podcast.id
                },
                {
                    headers: {
                        authToken: `Bearer: ${cookies.authToken}`
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
                '/api/comments',
                {
                    text,
                    comment_id: commentId
                },
                {
                    headers: {
                        authToken: `Bearer: ${cookies.authToken}`
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
                '/api/comments',
                {
                    data: {
                        comment_id: commentId
                    },
                    headers: {
                        authToken: `Bearer: ${cookies.authToken}`
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
                    const response = await axios.get(`/api/comments/${podcast.id}/${page}`)
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
        <div>
            {currentUser && <AddCommentSection addComment={addComment}/>}
            <CommentsList
                isMore={isMore}
                comments={comments}
                nextPageHandler={nextPageHandler}
                editCommentHandler={editCommentHandler}
                deleteCommentHandler={deleteCommentHandler}
            />
        </div>
    )
}