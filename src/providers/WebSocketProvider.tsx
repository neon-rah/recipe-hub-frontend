// components/WebSocketProvider.tsx
"use client";

import { ReactNode, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { initializeWebSocket, disconnectWebSocket } from "@/lib/webSocketClient";

interface WebSocketProviderProps {
    children: ReactNode;
}

export default function WebSocketProvider({ children }: WebSocketProviderProps) {
    const { user } = useAuth();
    const currentUserId = user?.idUser || null;

    useEffect(() => {
        initializeWebSocket(currentUserId);

        return () => {
            if (!currentUserId) {
                disconnectWebSocket();
            }
        };
    }, [currentUserId]); // Dépendance uniquement sur userId

    return <>{children}</>;
}