"use client";

import { useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNotificationStore } from "@/stores/notificationStore";
import { useCommentStore } from "@/stores/commentStore";
import { Notification } from "@/types/notification";
import { CommentDTO } from "@/types/comment";
import { useToast } from "@/hooks/use-toast";
import { getAuthToken } from "@/config/api";

export default function useWebSocket(userId: string | undefined, recipeId?: number) {
    const { toast } = useToast();
    const clientRef = useRef<Client | null>(null);

    // Memoize store actions to ensure stable references
    const addNotification = useCallback(
        (notification: Notification) => useNotificationStore.getState().addNotification(notification),
        []
    );
    const addComment = useCallback(
        (comment: CommentDTO) => useCommentStore.getState().addComment(comment),
        []
    );
    const addReply = useCallback(
        (reply: CommentDTO) => useCommentStore.getState().addReply(reply),
        []
    );
    const deleteComment = useCallback(
        (id: number) => useCommentStore.getState().deleteComment(id),
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

            // Subscribe to notifications
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

            // Subscribe to comments if recipeId is provided
            if (recipeId) {
                client.subscribe(`/topic/comments/${recipeId}`, (message) => {
                    try {
                        const comment: CommentDTO = JSON.parse(message.body);
                        console.log("[useWebSocket] New comment received:", comment);
                        if (comment.deleted) {
                            deleteComment(comment.idComment);
                            toast({
                                title: "Comment Deleted",
                                description: "The comment has been deleted successfully.",
                            });
                        } else if (comment.parentId) {
                            addReply(comment);
                            toast({
                                title: "New Reply",
                                description: `${comment.userFullName} replied to a comment.`,
                            });
                        } else {
                            addComment(comment);
                            toast({
                                title: "New Comment",
                                description: `${comment.userFullName} added a comment.`,
                            });
                        }
                    } catch (error) {
                        console.error("[useWebSocket] Error parsing comment:", error);
                        toast({
                            title: "Error",
                            description: "Failed to process comment",
                            variant: "destructive",
                        });
                    }
                });
            }
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
    }, [userId, recipeId, toast, addNotification, addComment, addReply, deleteComment]);

    return null;
}