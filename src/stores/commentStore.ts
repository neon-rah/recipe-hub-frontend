import { create } from 'zustand';
import { CommentDTO } from '@/types/comment';

interface CommentState {
    commentsByRecipe: Record<number, CommentDTO[]>;
    addComment: (recipeId: number, comment: CommentDTO) => void;
    addReply: (recipeId: number, reply: CommentDTO) => void;
    deleteComment: (recipeId: number, commentId: number) => void;
    setComments: (recipeId: number, comments: CommentDTO[]) => void;
    getComments: (recipeId: number) => CommentDTO[];
    clearRecipeComments: (recipeId: number) => void;
}

export const useCommentStore = create<CommentState>((set, get) => ({
    commentsByRecipe: {},

    getComments: (recipeId) => {
        return get().commentsByRecipe[recipeId] || [];
    },

    addComment: (recipeId, comment) =>
        set((state) => {
            const currentComments = state.commentsByRecipe[recipeId] || [];
            const exists = currentComments.some(c => c.idComment === comment.idComment);

            console.log('[commentStore] Adding comment:', comment.idComment, 'to recipe:', recipeId, 'Exists:', exists);

            if (exists) return state;

            return {
                commentsByRecipe: {
                    ...state.commentsByRecipe,
                    [recipeId]: [comment, ...currentComments],
                }
            };
        }),

    addReply: (recipeId, reply) =>
        set((state) => {
            const currentComments = state.commentsByRecipe[recipeId] || [];

            console.log('[commentStore] Adding reply:', reply.idComment, 'to parent:', reply.parentId, 'in recipe:', recipeId);

            const newComments = currentComments.map((comment) => {
                if (comment.idComment === reply.parentId) {
                    const replyExists = comment.replies?.some(r => r.idComment === reply.idComment) ?? false;
                    if (replyExists) return comment;

                    return {
                        ...comment,
                        replies: [...(comment.replies || []), reply],
                    };
                }
                return comment;
            });

            return {
                commentsByRecipe: {
                    ...state.commentsByRecipe,
                    [recipeId]: newComments,
                }
            };
        }),

    deleteComment: (recipeId, commentId) =>
        set((state) => {
            const currentComments = state.commentsByRecipe[recipeId] || [];

            console.log('[commentStore] Deleting comment:', commentId, 'from recipe:', recipeId);

            const newComments = currentComments
                .filter((comment) => comment.idComment !== commentId)
                .map((comment) => ({
                    ...comment,
                    replies: (comment.replies || []).filter((reply) => reply.idComment !== commentId),
                }));

            return {
                commentsByRecipe: {
                    ...state.commentsByRecipe,
                    [recipeId]: newComments,
                }
            };
        }),

    setComments: (recipeId, comments) => {
        console.log('[commentStore] Setting comments for recipe:', recipeId, 'count:', comments.length);
        set((state) => ({
            commentsByRecipe: {
                ...state.commentsByRecipe,
                [recipeId]: comments,
            }
        }));
    },

    clearRecipeComments: (recipeId) => {
        console.log('[commentStore] Clearing comments for recipe:', recipeId);
        set((state) => {
            const newCommentsByRecipe = { ...state.commentsByRecipe };
            delete newCommentsByRecipe[recipeId];
            return { commentsByRecipe: newCommentsByRecipe };
        });
    },
}));
