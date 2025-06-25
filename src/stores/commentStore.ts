import { create } from 'zustand';
import { CommentDTO } from '@/types/comment';

interface CommentState {
    comments: CommentDTO[];
    addComment: (comment: CommentDTO) => void;
    addReply: (reply: CommentDTO) => void;
    deleteComment: (commentId: number) => void;
    setComments: (comments: CommentDTO[]) => void;
}

export const useCommentStore = create<CommentState>((set) => ({
    comments: [],
    addComment: (comment) =>
        set((state) => ({
            comments: [comment, ...state.comments],
        })),
    addReply: (reply) =>
        set((state) => ({
            comments: state.comments.map((comment) =>
                comment.idComment === reply.parentId
                    ? { ...comment, replies: [...(comment.replies || []), reply] }
                    : comment
            ),
        })),
    deleteComment: (commentId) =>
        set((state) => ({
            comments: state.comments
                .filter((comment) => comment.idComment !== commentId)
                .map((comment) => ({
                    ...comment,
                    replies: comment.replies?.filter((reply) => reply.idComment !== commentId) || [],
                })),
        })),
    setComments: (comments) => set({ comments }),
}));