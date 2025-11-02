// CommentSection.tsx
"use client";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import { useState } from "react";
import { useComments } from "@/hooks/useComment";

interface CommentSectionProps {
    recipeId: number;
}

export default function CommentSection({ recipeId }: CommentSectionProps) {
    const {
        comments,
        commentCount,
        handleCreateComment,
        handleCreateReply,
        handleDeleteComment,
    } = useComments(recipeId);

    const [visibleReplies, setVisibleReplies] = useState<Record<number, boolean>>({});

    const handleReplySubmit = (parentId: number, content: string) => {
        handleCreateReply(parentId, content);
        // Auto-show replies when user submits a reply
        setVisibleReplies((prev) => ({
            ...prev,
            [parentId]: true,
        }));
    };

    const toggleReplies = (parentId: number) => {
        setVisibleReplies((prev) => ({
            ...prev,
            [parentId]: !prev[parentId],
        }));
    };

    return (
        <div className="mt-6 px-4 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Commentaires ({commentCount})
            </h3>
            <div className="space-y-4">
                {comments.map((parent) => {
                    const replies = parent.replies || [];
                    const show = visibleReplies[parent.idComment] ?? false;

                    return (
                        <div key={parent.idComment}>
                            <CommentItem
                                comment={parent}
                                onReply={handleReplySubmit}
                                onDelete={handleDeleteComment}
                                level={0}
                            />

                            {replies.length > 0 && (
                                <div
                                    className="ml-12 mt-2 text-sm text-blue-600 cursor-pointer hover:underline"
                                    onClick={() => toggleReplies(parent.idComment)}
                                >
                                    {show
                                        ? "Masquer les réponses"
                                        : `Afficher les ${replies.length} réponse(s)`}
                                </div>
                            )}

                            {show && replies.length > 0 && (
                                <div className="ml-6 mt-2 space-y-3">
                                    {replies.map((reply) => (
                                        <CommentItem
                                            key={reply.idComment}
                                            comment={reply}
                                            onReply={handleCreateReply}
                                            onDelete={handleDeleteComment}
                                            level={1}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="mt-6">
                <CommentInput onSubmit={handleCreateComment} />
            </div>
        </div>
    );
}
