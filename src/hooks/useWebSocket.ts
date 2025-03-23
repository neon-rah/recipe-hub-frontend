// hooks/useWebSocket.js
"use client";

import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNotificationStore } from "@/stores/notificationStore";
import {Notification} from "@/types/notification";

/**
 * Hook pour gérer la connexion WebSocket et recevoir les notifications en temps réel.
 * @param {string} userId - L'ID de l'utilisateur connecté pour s'abonner au topic correspondant.
 */
export default function useWebSocket(userId:string | undefined) {
    const { addNotification } = useNotificationStore((state) => ({
        addNotification: state.addNotification,
    }));

    useEffect(() => {
        if (!userId) {
            console.log("[useWebSocket] Aucun userId fourni, connexion annulée.");
            return;
        }

        // Initialisation de SockJS pour la compatibilité avec les navigateurs sans WebSocket natif
        const socket = new SockJS("http://localhost:8080/ws"); // Ajustez l'URL selon votre backend
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // Reconnexion automatique après 5 secondes en cas de déconnexion
            debug: (str) => console.log("[useWebSocket] Debug STOMP:", str), // Logs pour déboguer la connexion
        });

        stompClient.onConnect = () => {
            console.log("[useWebSocket] Connecté au WebSocket pour l'utilisateur:", userId);
            // S'abonner au topic spécifique de l'utilisateur
            stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
                try {
                    const notification = JSON.parse(message.body);
                    console.log("[useWebSocket] Nouvelle notification reçue:", notification);
                    addNotification(new Notification(notification)); // Ajouter la notification au store
                } catch (error) {
                    console.error("[useWebSocket] Erreur lors du parsing de la notification:", error);
                }
            });
        };

        stompClient.onStompError = (error) => {
            console.error("[useWebSocket] Erreur STOMP:", error);
        };

        stompClient.activate();

        // Nettoyage lors du démontage du composant
        return () => {
            stompClient.deactivate();
            console.log("[useWebSocket] Déconnecté du WebSocket pour l'utilisateur:", userId);
        };
    }, [userId, addNotification]);

    return null; // Ce hook ne retourne rien, il gère juste la connexion
}

