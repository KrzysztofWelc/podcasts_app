import React from "react";
import {CommentsProvider} from "../../contexts/CommentsContext";
import AddCommentSection from "./AddCommentForm";
import CommentsList from "./CommentsList";

export default function CommentsSection({podcast}) {

    return (
        <CommentsProvider>
            <AddCommentSection podcastId={podcast.id}/>
            <CommentsList/>
        </CommentsProvider>
    )
}