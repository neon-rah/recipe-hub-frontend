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
        set((state) => {
            // Vérifier que le commentaire n'existe pas déjà
            const exists = state.comments.some(c => c.idComment === comment.idComment);
            console.log('[commentStore] Adding comment:', comment.idComment, 'Exists:', exists);
            return exists ? state : { comments: [comment, ...state.comments] };
        }),
    addReply: (reply) =>
        set((state) => {
            console.log('[commentStore] Adding reply:', reply.idComment, 'to parent:', reply.parentId);
            return {
                comments: state.comments.map((comment) => {
                    // Vérifier si c'est le parent
                    if (comment.idComment === reply.parentId) {
                        // Vérifier que la réponse n'existe pas déjà
                        const replyExists = comment.replies?.some(r => r.idComment === reply.idComment) ?? false;
                        console.log('[commentStore] Reply exists:', replyExists);
                        return replyExists ? comment : {
                            ...comment,
                            replies: [...(comment.replies || []), reply]
                        };
                    }
                    return comment;
                }),
            };
        }),
    deleteComment: (commentId) =>
        set((state) => {
            console.log('[commentStore] Deleting comment:', commentId);
            return {
                comments: state.comments
                    .filter((comment) => comment.idComment !== commentId)
                    .map((comment) => ({
                        ...comment,
                        replies: comment.replies?.filter((reply) => reply.idComment !== commentId) || [],
                    })),
            };
        }),
    setComments: (comments) => {
        console.log('[commentStore] Setting comments:', comments.length);
        set({ comments });
    },
}));