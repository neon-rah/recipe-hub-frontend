import api from "@/config/api";
import { Notification } from "@/types/notification";

export const getNotifications = async (userId: string): Promise<Notification[]> => {
    const response = await api.get(`/notifications/${userId}`);
    return response.data.map((n: any) => new Notification(n));
};

export const deleteNotification = async (notifId: number): Promise<void> => {
    await api.delete(`/notifications/${notifId}`);
};

export const deleteAllNotifications = async (userId: string): Promise<void> => {
    await api.delete(`/notifications/user/${userId}`);
};

export const markNotificationAsRead = async (notifId: number): Promise<void> => {
    await api.put(`/notifications/${notifId}/mark-read`);
};

export const markNotificationAsSeen = async ( userId: string) : Promise<void> => {
    await api.put(`/notifications/${userId}/mark-all-seen`);
}

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
    await api.put(`/notifications/${userId}/mark-all-read`);
};