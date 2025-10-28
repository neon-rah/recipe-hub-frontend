import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useCommentStore } from "@/stores/commentStore";
import { CommentDTO } from "@/types/comment";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { createComment, createReply, deleteComment, fetchCommentCount, fetchComments } from "@/lib/api/commentApi";

/**
 * Hook de gestion des commentaires avec WebSocket STOMP + Zustand
 * @param recipeId ID de la recette à suivre
 */
export const useComments = (recipeId: number) => {
    const { comments, addComment, addReply, deleteComment: storeDeleteComment, setComments } = useCommentStore();
    const { user } = useAuth();
    const { toast } = useToast();

    const clientRef = useRef<Client | null>(null);
    const subscriptionRef = useRef<string | null>(null);
    const prevRecipeIdRef = useRef<number | null>(null);
    const [commentCount, setCommentCount] = useState<number>(0);

    /**
     * 1️⃣ Initialisation du client WebSocket STOMP (une seule fois)
     */
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (msg) => console.log("[STOMP Debug]", msg),
        });

        clientRef.current = client;
        client.activate();

        return () => {
            console.log("[useComments] Cleanup global: deactivate client");
            client.deactivate();
        };
    }, []); // 👈 S’exécute une seule fois au montage

    /**
     * 2️⃣ Gestion du chargement et de l’abonnement des commentaires selon la recette
     */
    useEffect(() => {
        // Si on change de recette, on nettoie
        if (prevRecipeIdRef.current !== null && prevRecipeIdRef.current !== recipeId) {
            console.log("[useComments] Recipe changed, reset comments");
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
                    fetchCommentCount(recipeId),
                ]);
                setComments(fetchedComments);
                setCommentCount(count);
            } catch (err) {
                console.error("Erreur lors du chargement des commentaires :", err);
                toast({
                    title: "Erreur",
                    description: err instanceof Error ? err.message : "Échec du chargement des commentaires",
                    variant: "destructive",
                });
            }
        };

        loadComments();

        if (!clientRef.current) return;
        const client = clientRef.current;

        const subscribeToTopic = () => {
            console.log("[useComments] Subscribing to topic:", `/topic/comments/${recipeId}`);
            const subscription = client.subscribe(`/topic/comments/${recipeId}`, (message) => {
                try {
                    const comment: CommentDTO = JSON.parse(message.body);
                    console.log("[useComments] Received via WS:", comment);

                    if (comment.deleted) {
                        storeDeleteComment(comment.idComment);
                        setCommentCount((prev) => Math.max(prev - 1, 0));
                    } else if (comment.parentId) {
                        addReply(comment); // ✅ le store gère les doublons
                        setCommentCount((prev) => prev + 1);
                    } else {
                        addComment(comment);
                        setCommentCount((prev) => prev + 1);
                    }
                } catch (err) {
                    console.error("[useComments] Error processing WS message:", err);
                }
            });

            subscriptionRef.current = subscription.id;
        };

        if (client.connected) {
            subscribeToTopic();
        } else {
            client.onConnect = subscribeToTopic;
        }

        // Nettoyage à chaque changement de recette
        return () => {
            if (clientRef.current && subscriptionRef.current) {
                console.log("[useComments] Unsubscribe from topic:", subscriptionRef.current);
                clientRef.current.unsubscribe(subscriptionRef.current);
                subscriptionRef.current = null;
            }
        };
    }, [recipeId, setComments, addComment, addReply, storeDeleteComment, toast]);

    /**
     * 3️⃣ Gestion des actions utilisateur
     */
    const handleCreateComment = async (content: string) => {
        if (!user?.idUser) {
            toast({
                title: "Erreur",
                description: "Vous devez être connecté pour commenter",
                variant: "destructive",
            });
            return;
        }
        try {
            await createComment(recipeId, content);
        } catch (err) {
            toast({
                title: "Erreur",
                description: err instanceof Error ? err.message : "Échec de la création du commentaire",
                variant: "destructive",
            });
        }
    };

    const handleCreateReply = async (parentId: number, content: string) => {
        if (!user?.idUser) {
            toast({
                title: "Erreur",
                description: "Vous devez être connecté pour répondre",
                variant: "destructive",
            });
            return;
        }
        try {
            await createReply(parentId, recipeId, content);
        } catch (err) {
            toast({
                title: "Erreur",
                description: err instanceof Error ? err.message : "Échec de la création de la réponse",
                variant: "destructive",
            });
        }
    };

    const handleDeleteComment = async (id: number) => {
        if (!user?.idUser) {
            toast({
                title: "Erreur",
                description: "Vous devez être connecté pour supprimer",
                variant: "destructive",
            });
            return;
        }
        try {
            await deleteComment(id);
        } catch (err) {
            toast({
                title: "Erreur",
                description: err instanceof Error ? err.message : "Échec de la suppression",
                variant: "destructive",
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
