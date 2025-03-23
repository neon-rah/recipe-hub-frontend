// components/features/NotificationCard.tsx
"use client";

import { XCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Notification } from "@/types/notification";
import { timeSince } from "@/lib/utils";
import { useNotificationStore } from "@/stores/notificationStore";
import Image from "next/image";
import { useRecipeStore } from "@/stores/recipe-store";
import { getRecipeById } from "@/lib/api/recipeApi";
import { Recipe } from "@/types/recipe";

interface NotificationCardProps { notif: Notification; className?: string; }

export default function NotificationCard({ notif, className }: NotificationCardProps) {
    const router = useRouter();
    const { removeNotification, markAsRead } = useNotificationStore();
    const { setSelectedRecipe } = useRecipeStore();

    const handleClick = async () => {
        try {
            await markAsRead(notif.idNotif);
            console.log("[NotificationCard] Marquée comme lue:", notif.idNotif);
            if (notif.entityType === "user") {
                router.push(`/profile/${notif.senderId}`);
            } else if (notif.entityType === "recipe" && notif.relatedEntityId) {
                const recipe = await getRecipeNotified(notif.relatedEntityId);
                router.push(`/profile/${notif.senderId}?recipeId=${notif.relatedEntityId}`);
            }
        } catch (error) {
            console.error("[NotificationCard] Erreur clic:", error);
        }
    };

    const getRecipeNotified = async (notifId: number) => {
        try {
            const resp = await getRecipeById(notifId);
            const recipe = new Recipe(resp);
            setSelectedRecipe(recipe);
            return recipe;
        } catch (e) {
            console.error("[NotificationCard] Erreur recette:", e);
            setSelectedRecipe(null);
            return null;
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeNotification(notif.idNotif);
        console.log("[NotificationCard] Supprimée:", notif.idNotif);
    };

    return (
        <div
            className={`flex items-center justify-between rounded-lg relative cursor-pointer p-2 transition-colors ${
                notif.read ? "bg-gray-100 dark:bg-gray-800" : "bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500"
            } ${className}`}
            onClick={handleClick}
        >
            <div className="flex items-start gap-3 w-[85%]">
                <Image
                    src={notif.senderProfileUrl}
                    alt={notif.userName}
                    width={40}
                    height={40}
                    className="rounded-full h-[40px] w-[40px] object-cover"
                />
                <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-200 hover:underline">
                        {notif.message}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{timeSince(notif.createdAt)}</p>
                </div>
            </div>
            <button
                type="button"
                className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                onClick={handleDelete}
            >
                <XCircleIcon className="w-5 h-5 text-red-500" />
            </button>
        </div>
    );
}

/**
 * Points de débogage :
 * 1. Loguez `markAsRead` et redirection.
 * 2. Vérifiez `getRecipeNotified`.
 */