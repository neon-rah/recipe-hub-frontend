"use client";

import { useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNotificationStore } from "@/stores/notificationStore";
import { Notification } from "@/types/notification";
import { useToast } from "@/hooks/use-toast";
import { getAuthToken } from "@/config/api";

/**
 * Hook for managing WebSocket connection for notifications only.
 * Comment subscriptions are handled in useComments hook to avoid conflicts.
 */
export default function useWebSocket(userId: string | undefined) {
    const { toast } = useToast();
    const clientRef = useRef<Client | null>(null);

    // Memoize store actions to ensure stable references
    const addNotification = useCallback(
        (notification: Notification) => useNotificationStore.getState().addNotification(notification),
        []
    );

    useEffect(() => {
        if (!userId) {
            console.log("[useWebSocket] No userId provided, connection aborted.");
            return;
        }

        // Prevent multiple connections
        if (clientRef.current?.active) {
            console.log("[useWebSocket] WebSocket already connected for user:", userId);
            return;
        }

        const socket = new SockJS("http://localhost:8080/ws");
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => console.log("[useWebSocket] Debug STOMP:", str),
            connectHeaders: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        clientRef.current = client;

        client.onConnect = () => {
            console.log("[useWebSocket] Connected to WebSocket for user:", userId);

            // Subscribe to notifications only
            client.subscribe(`/topic/notifications/${userId}`, (message) => {
                try {
                    const notification = JSON.parse(message.body);
                    console.log("[useWebSocket] New notification received:", notification);
                    addNotification(new Notification(notification));
                    toast({
                        title: "New Notification",
                        description: notification.message,
                    });
                } catch (error) {
                    console.error("[useWebSocket] Error parsing notification:", error);
                    toast({
                        title: "Error",
                        description: "Failed to process notification",
                        variant: "destructive",
                    });
                }
            });
        };

        client.onStompError = (error) => {
            console.error("[useWebSocket] STOMP Error:", error);
            toast({
                title: "WebSocket Error",
                description: "Failed to connect to real-time server",
                variant: "destructive",
            });
        };

        client.activate();

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
                console.log("[useWebSocket] Disconnected from WebSocket for user:", userId);
                clientRef.current = null;
            }
        };
    }, [userId, toast, addNotification]);

    return null;
}
