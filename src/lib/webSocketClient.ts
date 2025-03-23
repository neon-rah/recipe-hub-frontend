// lib/webSocketClient.ts
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNotificationStore } from "@/stores/notificationStore";
import {Notification} from "@/types/notification";

let stompClient: Client | null = null;
let currentUserId: string | null = null;

// lib/webSocketClient.ts
export function initializeWebSocket(userId: string | null) {
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
            stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
                console.log("[webSocketClient] Message brut reçu:", message.body);
                try {
                    const notification = JSON.parse(message.body);
                    console.log("[webSocketClient] Notification parsée:", notification);
                    useNotificationStore.getState().addNotification(new Notification(notification));
                } catch (error) {
                    console.error("[webSocketClient] Erreur parsing:", error);
                }
            });
            console.log("[webSocketClient] Abonné à: /topic/notifications/" + userId);
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