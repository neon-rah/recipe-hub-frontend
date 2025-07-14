// CommentSection.tsx
"use client";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import { useEffect, useState } from "react";
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

    useEffect(() => {
        const parentComments = comments.filter(c => c.parentId === 0 || c.parentId === null);
        const initialVisibleState: Record<number, boolean> = {};
        parentComments.forEach(parent => {
            initialVisibleState[parent.idComment] = false; // cacher par défaut
        });
        setVisibleReplies(prev => ({ ...initialVisibleState, ...prev }));
    }, [comments]);

    const parentComments = comments.filter(c => c.parentId === 0 || c.parentId === null);
    const childComments = comments.filter(c => c.parentId !== 0 && c.parentId !== null);

    return (
        <div className="mt-6 px-4 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Commentaires ({commentCount})
            </h3>
            <div className="space-y-4">
                {parentComments.map((parent) => {
                    const replies = childComments.filter(c => c.parentId === parent.idComment);
                    const show = visibleReplies[parent.idComment] ?? false;

                    return (
                        <div key={parent.idComment}>
                            <CommentItem
                                comment={parent}
                                onReply={(parentId, content) => {
                                    handleCreateReply(parentId, content);
                                    setVisibleReplies((prev) => ({
                                        ...prev,
                                        [parent.idComment]: true,
                                    }));
                                }}
                                onDelete={handleDeleteComment}
                                level={0}
                            />

                            {replies.length > 0 && (
                                <div
                                    className="ml-12 mt-2 text-sm text-blue-600 cursor-pointer hover:underline"
                                    onClick={() =>
                                        setVisibleReplies((prev) => ({
                                            ...prev,
                                            [parent.idComment]: !show,
                                        }))
                                    }
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