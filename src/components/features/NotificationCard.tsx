"use client";

import { XCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Notification } from "@/types/notification";
import { timeSince } from "@/lib/utils";
import { useNotificationStore } from "@/stores/notificationStore";
import Image from "next/image";
import {useRecipeStore} from "@/stores/recipe-store";
import {getRecipeById} from "@/lib/api/recipeApi";
import {Recipe} from "@/types/recipe";

interface NotificationCardProps {
    notif: Notification;
    className?: string;
}

export default function NotificationCard({ notif, className }: NotificationCardProps) {
    const router = useRouter();
    const { removeNotification, markAsRead } = useNotificationStore();
    const {setSelectedRecipe} = useRecipeStore();

    const handleClick = () => {
        markAsRead(notif.idNotif); // Marquer comme lu
        if (notif.entityType === "user") {
            router.push(`/profile/${notif.senderId}`); // Redirection vers le profil
        } else if (notif.entityType === "recipe" && notif.relatedEntityId) {
            getRecipeNotified(notif.relatedEntityId)
                .then(r =>
                    router.push(`/recipes`)
                );
        }
    };
    
    const getRecipeNotified= async( notifId : number) =>{
        try {
            const resp = await getRecipeById(notifId);
            setSelectedRecipe ( new Recipe( resp));
        }catch (e:any){
            console.log( "[NotifCard] an error occured when getting the recipe notified ", e);
            setSelectedRecipe(null);
        }

    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        removeNotification(notif.idNotif); 
    };

    return (
        <div
            className={`flex items-center justify-between rounded-lg relative cursor-pointer ${
                notif.read ? "bg-gray-100" : "bg-blue-50"
            } dark:${notif.read ? "bg-gray-900" : "bg-blue-900"} ${className}`}
            onClick={handleClick}
        >
            <div className="flex items-start gap-3 py-2 px-3 w-[85%]">
                <Image
                    src={notif.senderProfileUrl}
                    alt={notif.userName}
                    width={40}
                    height={40}
                    className="rounded-full h-[40px] w-[40px] object-cover"
                />
                <div className="flex flex-col">
                    <p className="text-sm font-semibold text-black-100 dark:text-gray-400 hover:underline">
                        {notif.message}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-200">{timeSince(notif.createdAt)}</p>
                </div>
            </div>
            <button
                type="button"
                className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md dark:bg-secondary-dark hover:bg-gray-200 dark:hover:bg-secondary-dark/50"
                onClick={handleDelete}
            >
                <XCircleIcon className="w-5 h-5 text-red-500 dark:text-red-500" />
            </button>
        </div>
    );
}