import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNotificationStore } from "@/stores/notificationStore";
import { useCommentStore } from "@/stores/commentStore";
import { Notification } from "@/types/notification";
import { CommentDTO } from "@/types/comment";

let stompClient: Client | null = null;
let currentUserId: string | null = null;

export function initializeWebSocket(userId: string | null, recipeId?: number) {
    if (!userId) {
        console.log("[webSocketClient] Aucun userId, connexion annulée.");
        disconnectWebSocket();
        return;
    }

    if (stompClient && currentUserId === userId) {
        console.log("[webSocketClient] Connexion déjà active pour:", userId);
        return;
    }

    disconnectWebSocket();

    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        debug: (str) => console.log("[webSocketClient] Debug:", str),
    });

    stompClient.onConnect = () => {
        console.log("[webSocketClient] Connecté pour:", userId);
        if (stompClient && userId) {
            // Abonnement aux notifications
            stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
                console.log("[webSocketClient] Message brut reçu (notification):", message.body);
                try {
                    const notification = JSON.parse(message.body);
                    useNotificationStore.getState().addNotification(new Notification(notification));
                } catch (error) {
                    console.error("[webSocketClient] Erreur parsing notification:", error);
                }
            });
            console.log("[webSocketClient] Abonné à: /topic/notifications/" + userId);

            // Abonnement aux commentaires si recipeId est fourni
            if (recipeId) {
                stompClient.subscribe(`/topic/comments/${recipeId}`, (message) => {
                    console.log("[webSocketClient] Message brut reçu (commentaire):", message.body);
                    try {
                        const comment: CommentDTO = JSON.parse(message.body);
                        const { addComment, addReply, deleteComment } = useCommentStore.getState();
                        if (comment.deleted) {
                            deleteComment(comment.idComment);
                        } else if (comment.parentId) {
                            addReply(comment);
                        } else {
                            addComment(comment);
                        }
                    } catch (error) {
                        console.error("[webSocketClient] Erreur parsing commentaire:", error);
                    }
                });
                console.log("[webSocketClient] Abonné à: /topic/comments/" + recipeId);
            }
        }
    };

    stompClient.onStompError = (error) => {
        console.error("[webSocketClient] Erreur STOMP:", error);
    };

    console.log("[webSocketClient] Tentative de connexion pour:", userId);
    stompClient.activate();
    currentUserId = userId;
}

export function disconnectWebSocket() {
    if (stompClient) {
        stompClient.deactivate();
        console.log("[webSocketClient] Déconnecté pour:", currentUserId);
        stompClient = null;
        currentUserId = null;
    }
}