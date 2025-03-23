// stores/notificationStore.ts
import { create } from "zustand";
import { Notification } from "@/types/notification";
import {
    getNotifications,
    deleteNotification,
    deleteAllNotifications,
    markNotificationAsRead,
    markNotificationAsSeen
} from "@/lib/api/notifApi";

interface NotificationState {
    notifications: Notification[];
    newNotificationCount: number;
    loading: boolean;
    error: string | null;
    currentPathname: string; // Nouveau champ pour suivre la page actuelle
    fetchNotifications: (userId: string) => Promise<void>;
    addNotification: (notification: Notification) => void;
    removeNotification: (notifId: number) => Promise<void>;
    clearAllNotifications: (userId: string) => Promise<void>;
    markAsRead: (notifId: number) => Promise<void>;
    markAllAsSeen : (userId: string) => Promise<void>;
    resetNewNotificationCount: () => void;
    setCurrentPathname: (pathname: string) => void; // Nouvelle méthode
    getUnreadCount: (userId: string) => number;
    getUnseenCount : (userId:string) => number ;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    newNotificationCount: 0,
    loading: false,
    error: null,
    currentPathname: "", // Initialisé vide

    fetchNotifications: async (userId) => {
        set({ loading: true });
        try {
            const notifications = await getNotifications(userId);
            console.log("[notificationStore] Notifications récupérées:", notifications);
            const unseenCount = notifications.filter(n => !n.seen).length;
            set({ notifications,newNotificationCount:unseenCount, loading: false, error: null });
        } catch (err) {
            console.error("[notificationStore] Erreur récupération:", err);
            set({ loading: false, error: err.message || "Échec récupération" });
        }
    },

    addNotification: (notification) => {
        set((state) => {
            const isOnNotificationsPage = state.currentPathname === "/notifications";
            const updatedState = {
                notifications: [notification, ...state.notifications],
                newNotificationCount: isOnNotificationsPage ? state.newNotificationCount : state.newNotificationCount + 1,
            };
            console.log("[notificationStore] État mis à jour:", updatedState, "isOnNotificationsPage:", isOnNotificationsPage);
            return updatedState;
        });
        console.log("[notificationStore] Notification ajoutée:", notification);
    },

    removeNotification: async (notifId) => {
        try {
            await deleteNotification(notifId);
            set((state) => ({
                notifications: state.notifications.filter((n) => n.idNotif !== notifId),
            }));
        } catch (err) {
            console.error("[notificationStore] Erreur suppression:", err);
            set({ error: err.message || "Échec suppression" });
        }
    },

    clearAllNotifications: async (userId) => {
        try {
            await deleteAllNotifications(userId);
            set({ notifications: [], newNotificationCount: 0 });
        } catch (err) {
            console.error("[notificationStore] Erreur effacement:", err);
            set({ error: err.message || "Échec effacement" });
        }
    },

    markAsRead: async (notifId) => {
        try {
            await markNotificationAsRead(notifId);
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.idNotif === notifId ? { ...n, read: true } : n
                ),
            }));
        } catch (err) {
            console.error("[notificationStore] Erreur marquage:", err);
            set({ error: err.message || "Échec marquage" });
        }
    },

    markAllAsSeen : async (userId) =>{
        try {
            await markNotificationAsSeen(userId);
            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, isSeen: true })),
                newNotificationCount: 0, 
            }));
            console.log("[notificationStore] Toutes notifications marquées comme vues pour:", userId);
        } catch (err) {
            console.error("[notificationStore] Erreur marquage vues:", err);
            set({ error: err.message || "Échec marquage vues" });
        }
    },

    resetNewNotificationCount: () => {
        set({ newNotificationCount: 0 });
        console.log("[notificationStore] Compteur de nouvelles notifications réinitialisé");
    },

    setCurrentPathname: (pathname) => {
        set({ currentPathname: pathname });
        console.log("[notificationStore] Page actuelle mise à jour:", pathname);
    },

    getUnreadCount: (userId: string) => {
        const count = get().notifications.filter(n => n.idUser === userId && !n.read).length;
        return count;
    },

    getUnseenCount :(userId : string) =>{
        return get().notifications.filter( n => n.idUser === userId && !n.seen).length;
    },
}));