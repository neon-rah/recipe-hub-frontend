import { create } from "zustand";
import { Notification } from "@/types/notification";
import {
    getNotifications,
    deleteNotification,
    deleteAllNotifications,
    markNotificationAsRead,
} from "@/lib/api/notifApi";

interface NotificationState {
    notifications: Notification[];
    loading: boolean;
    error: string | null;
    fetchNotifications: (userId: string) => Promise<void>;
    removeNotification: (notifId: number) => Promise<void>;
    clearAllNotifications: (userId: string) => Promise<void>;
    markAsRead: (notifId: number) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    loading: false,
    error: null,

    fetchNotifications: async (userId: string) => {
        set({ loading: true });
        try {
            const notifications = await getNotifications(userId);
            set({ notifications, loading: false, error: null });
        } catch (err: any) {
            set({ loading: false, error: err.message || "Failed to fetch notifications" });
        }
    },

    removeNotification: async (notifId: number) => {
        try {
            await deleteNotification(notifId);
            set((state) => ({
                notifications: state.notifications.filter((n) => n.idNotif !== notifId),
            }));
        } catch (err: any) {
            set({ error: err.message || "Failed to delete notification" });
        }
    },

    clearAllNotifications: async (userId: string) => {
        try {
            await deleteAllNotifications(userId);
            set({ notifications: [] });
        } catch (err: any) {
            set({ error: err.message || "Failed to clear notifications" });
        }
    },

    markAsRead: async (notifId: number) => {
        try {
            await markNotificationAsRead(notifId);
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.idNotif === notifId ? { ...n, read: true } : n
                ),
            }));
        } catch (err: any) {
            set({ error: err.message || "Failed to mark as read" });
        }
    },
}));