import React, {useContext, useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import axios from "axios";

const CommentsContext = React.createContext()

export function useComments() {
    return useContext(CommentsContext)
}

export function CommentsProvider({children}) {
    const [comments, setComments] = useState([])
    const cookies = useCookies()[0]

    async function addComment(text, podcastId) {
        try {
            const {data: comment} = await axios.post(
                '/comments',
                {
                    text,
                    podcast_id: podcastId
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

    const value = {addComment, comments}
    return (
        <CommentsContext.Provider value={value}>
            {children}
        </CommentsContext.Provider>
    )
}