import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useCommentStore } from "@/stores/commentStore";
import { CommentDTO } from "@/types/comment";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { createComment, createReply, deleteComment, fetchCommentCount, fetchComments } from "@/lib/api/commentApi";

export const useComments = (recipeId: number) => {
    const { comments, addComment,addReply, deleteComment: storeDeleteComment, setComments } = useCommentStore();
    const { user } = useAuth();
    const { toast } = useToast();
    const clientRef = useRef<Client | null>(null);
    // const isInitialized = useRef(false);
    const [commentCount, setCommentCount] = useState<number>(0);
    const subscriptionRef = useRef<string | null>(null);
    const prevRecipeIdRef = useRef<number | null>(null);

    useEffect(() => {
        // Réinitialiser lorsque la recette change
        if (prevRecipeIdRef.current !== null && prevRecipeIdRef.current !== recipeId) {
            setComments([]);
            setCommentCount(0);
            if (clientRef.current && subscriptionRef.current) {
                clientRef.current.unsubscribe(subscriptionRef.current);
                subscriptionRef.current = null;
            }
        }
        prevRecipeIdRef.current = recipeId;

        const loadComments = async () => {
            try {
                const [fetchedComments, count] = await Promise.all([
                    fetchComments(recipeId),
                    fetchCommentCount(recipeId)
                ]);
                setComments(fetchedComments);
                setCommentCount(count);
            } catch (err) {
                console.error('Erreur lors du chargement des commentaires :', err);
                toast({
                    title: 'Erreur',
                    description: err instanceof Error ? err.message : 'Échec du chargement des commentaires',
                    variant: 'destructive',
                });
            }
        };

        loadComments();

        if (!clientRef.current) {
            const socket = new SockJS('http://localhost:8080/ws');
            const client = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,
                debug: (str) => console.log('[useComments] Debug STOMP:', str),
            });

            clientRef.current = client;

            // Dans useComment.ts

            client.onConnect = () => {
                console.log('[useComments] Connected to WebSocket for recipe:', recipeId);

                if (subscriptionRef.current) {
                    client.unsubscribe(subscriptionRef.current);
                }

                const subscription = client.subscribe(`/topic/comments/${recipeId}`, (message) => {
                    try {
                        const comment: CommentDTO = JSON.parse(message.body);
                        console.log('[useComments] Received comment via WS:', comment);

                        if (comment.deleted) {
                            console.log('[useComments] Processing deleted comment:', comment.idComment);
                            storeDeleteComment(comment.idComment);
                            setCommentCount(prev => Math.max(prev - 1, 0));
                        } else {
                            // Vérification plus robuste des doublons
                            const isDuplicate = comments.some(c =>
                                c.idComment === comment.idComment ||
                                (c.replies && c.replies.some(r => r.idComment === comment.idComment))
                            );

                            console.log('[useComments] Is duplicate:', isDuplicate, 'for comment:', comment.idComment);

                            if (!isDuplicate) {
                                if (comment.parentId) {
                                    console.log('[useComments] Adding reply:', comment.idComment, 'to parent:', comment.parentId);
                                    addReply(comment);
                                } else {
                                    console.log('[useComments] Adding new parent comment:', comment.idComment);
                                    addComment(comment);
                                }
                                setCommentCount(prev => prev + 1);
                            }
                        }
                    } catch (err) {
                        console.error('[useComments] Error processing WS message:', err);
                    }
                });

                subscriptionRef.current = subscription.id;
            };

            client.onStompError = (err) => {
                console.error('[useComments] STOMP Error:', err);
            };

            client.activate();

            return () => {
                if (clientRef.current && subscriptionRef.current) {
                    clientRef.current.unsubscribe(subscriptionRef.current);
                    clientRef.current.deactivate();
                }
            };
        }
    }, [recipeId, setComments, addComment, storeDeleteComment, toast, comments, addReply]);

    const handleCreateComment = async (content: string) => {
        if (!user?.idUser) {
            toast({
                title: 'Erreur',
                description: 'Vous devez être connecté pour commenter',
                variant: 'destructive',
            });
            return;
        }
        try {
            await createComment(recipeId, content);
        } catch (err) {
            toast({
                title: 'Erreur',
                description: err instanceof Error ? err.message : 'Échec de la création du commentaire',
                variant: 'destructive',
            });
        }
    };

    const handleCreateReply = async (parentId: number, content: string) => {
        if (!user?.idUser) {
            toast({
                title: 'Erreur',
                description: 'Vous devez être connecté pour répondre',
                variant: 'destructive',
            });
            return;
        }
        try {
            await createReply(parentId, recipeId, content);
        } catch (err) {
            toast({
                title: 'Erreur',
                description: err instanceof Error ? err.message : 'Échec de la création de la réponse',
                variant: 'destructive',
            });
        }
    };

    const handleDeleteComment = async (id: number) => {
        if (!user?.idUser) {
            toast({
                title: 'Erreur',
                description: 'Vous devez être connecté pour supprimer',
                variant: 'destructive',
            });
            return;
        }
        try {
            await deleteComment(id);
        } catch (err) {
            toast({
                title: 'Erreur',
                description: err instanceof Error ? err.message : 'Échec de la suppression',
                variant: 'destructive',
            });
        }
    };

    return {
        comments,
        commentCount,
        handleCreateComment,
        handleCreateReply,
        handleDeleteComment,
    };
};
