// pages/notifications.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { SubHeader } from "@/components/ui/subheader";
import { FaBell } from "react-icons/fa";
import NotificationCard from "@/components/features/NotificationCard";
import { Badge } from "@/components/ui/badge";
import { useNotificationStore } from "@/stores/notificationStore";
import useAuth from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
    const { user } = useAuth();
    const currentUserId = user?.idUser;

    const { notifications, loading, error,markAllAsSeen, fetchNotifications, clearAllNotifications, resetNewNotificationCount } = useNotificationStore();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Mémoïser handleClearAll pour éviter des re-rendus inutiles
    const handleClearAll = useCallback(async () => {
        if (currentUserId) {
            await clearAllNotifications(currentUserId);
            setIsDialogOpen(false);
            console.log("[NotificationsPage] Notifications effacées.");
        }
    }, [currentUserId, clearAllNotifications]);

    useEffect(() => {
        if (currentUserId) {
            fetchNotifications(currentUserId);
            markAllAsSeen(currentUserId);
            resetNewNotificationCount();
            console.log("[NotificationsPage] Notifications chargées pour:", currentUserId);
        }
    }, [currentUserId, fetchNotifications,markAllAsSeen, resetNewNotificationCount]);

    if (loading) return <div className="p-4 text-center">Chargement...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="flex justify-center flex-col">
            <SubHeader
                name="Notifications"
                icon={<FaBell size={20} />}
                sticky={true}
                rightContent={
                    notifications.length > 0 && (
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Badge className="cursor-pointer hover:bg-gray-200">Tout effacer</Badge>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Effacer toutes les notifications</DialogTitle>
                                    <DialogDescription>
                                        Êtes-vous sûr de vouloir supprimer toutes vos notifications ? Cette action est irréversible.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button variant="destructive" onClick={handleClearAll}>
                                        Tout effacer
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )
                }
            />
            <div className="flex flex-col p-6 gap-5">
                <div className="flex flex-col justify-content items-center gap-2">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <NotificationCard
                                key={notif.idNotif}
                                notif={notif}
                                className="lg:w-full md:w-[70%]"
                            />
                        ))
                    ) : (
                        <div>Aucune notification à afficher.</div>
                    )}
                </div>
            </div>
        </div>
    );
}