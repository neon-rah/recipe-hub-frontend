"use client";

import { SubHeader } from "@/components/ui/subheader";
import { FaBell } from "react-icons/fa";
import NotificationCard from "@/components/features/NotificationCard";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { useNotificationStore } from "@/stores/notificationStore";
import useAuth from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {useEffect, useState} from "react";

export default function NotificationsPage() {
    const { user } = useAuth();
    const currentUserId = user?.idUser;
    const { notifications, loading, error, fetchNotifications, clearAllNotifications } = useNotificationStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Charger les notifications au montage
    useEffect(() => {
        if (currentUserId) {
            fetchNotifications(currentUserId);
        }
    }, [currentUserId, fetchNotifications]);

    const handleClearAll = async () => {
        if (currentUserId) {
            await clearAllNotifications(currentUserId);
            setIsDialogOpen(false);
        }
    };

    if (loading) return <div className="p-4 text-center">Loading notifications...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <ProtectedRoute>
            <div className="flex justify-center flex-col">
                <SubHeader
                    name="Notifications"
                    icon={<FaBell size={20} />}
                    sticky={true}
                    rightContent={
                        notifications.length > 0 && (
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Badge className="cursor-pointer hover:bg-gray-200">Clear All</Badge>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Clear All Notifications</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete all your notifications? This action cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={handleClearAll}>
                                            Clear All
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
                            <div>No notifications to show.</div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}