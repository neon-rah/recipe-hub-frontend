import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useCommentStore } from "@/stores/commentStore";
import { CommentDTO } from "@/types/comment";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { createComment, createReply, deleteComment, fetchCommentCount, fetchComments } from "@/lib/api/commentApi";

export const useComments = (recipeId: number) => {
    const { comments, addComment, addReply, deleteComment: storeDeleteComment, setComments } = useCommentStore();
    const { user } = useAuth();
    const { toast } = useToast();
    const clientRef = useRef<Client | null>(null);
    const isInitialized = useRef(false);
    const [commentCount, setCommentCount] = useState<number>(0);
    const subscriptionRef = useRef<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadComments = async () => {
            try {
                console.log('Tentative de chargement des commentaires pour recipeId:', recipeId); // Débogage
                const fetchedComments = await fetchComments(recipeId);
                console.log('Commentaires fetchés :', fetchedComments); // Débogage
                if (isMounted) setComments(fetchedComments);
                const count = await fetchCommentCount(recipeId);
                console.log('Nombre de commentaires fetché :', count); // Débogage
                setCommentCount(count);
            } catch (err) {
                console.error('Erreur lors du chargement des commentaires :', err); // Débogage
                if (isMounted) {
                    toast({
                        title: 'Erreur',
                        description: err instanceof Error ? err.message : 'Échec du chargement des commentaires',
                        variant: 'destructive',
                    });
                }
            }
        };

        if (!isInitialized.current) {
            loadComments();
            isInitialized.current = true;
        }

        if (!clientRef.current) {
            const socket = new SockJS('http://localhost:8080/ws');
            const client = new Client({
                webSocketFactory: () => socket,
                reconnectDelay: 5000,
                debug: (str) => console.log('[useComments] Debug STOMP:', str),
                
            });

            clientRef.current = client;

            client.onConnect = () => {
                console.log('[useComments] Connected to WebSocket for recipe:', recipeId);
                if (subscriptionRef.current) {
                    client.unsubscribe(subscriptionRef.current);
                }
                const subscription = client.subscribe(`/topic/comments/${recipeId}`, (message) => {
                    try {
                        const comment: CommentDTO = JSON.parse(message.body);
                        if (comment.deleted) {
                            storeDeleteComment(comment.idComment);
                            setCommentCount((prev) => Math.max(prev - 1, 0));
                            toast({ title: 'Commentaire supprimé', description: 'Le commentaire a été supprimé.' });
                        } else if (comment.parentId) {
                            const existingComment = comments.find((c) => c.idComment === comment.idComment);
                            if (!existingComment) {
                                addReply(comment);
                                setCommentCount((prev) => prev + 1);
                                toast({
                                    title: 'Nouvelle réponse',
                                    description: `${comment.userFullName} a répondu.`,
                                });
                            }
                        } else {
                            const existingComment = comments.find((c) => c.idComment === comment.idComment);
                            if (!existingComment) {
                                addComment(comment);
                                setCommentCount((prev) => prev + 1);
                                toast({
                                    title: 'Nouveau commentaire',
                                    description: `${comment.userFullName} a commenté.`,
                                });
                            }
                        }
                    } catch (err) {
                        toast({
                            title: 'Erreur',
                            description: 'Échec du traitement du commentaire',
                            variant: 'destructive',
                        });
                    }
                });
                subscriptionRef.current = subscription.id;
            };

            client.onStompError = (err) => {
                console.error('[useComments] STOMP Error:', err);
                toast({
                    title: 'Erreur WebSocket',
                    description: 'Échec de la connexion au serveur en temps réel',
                    variant: 'destructive',
                });
            };

            client.activate();

            return () => {
                isMounted = false;
                if (clientRef.current && subscriptionRef.current) {
                    clientRef.current.unsubscribe(subscriptionRef.current);
                    clientRef.current.deactivate();
                    clientRef.current = null;
                    subscriptionRef.current = null;
                }
            };
        }
    }, [recipeId, setComments, addComment, addReply, storeDeleteComment, toast, comments]);

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