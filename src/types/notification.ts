export interface NotificationDTO {
    idNotif: number;
    senderId: string; // UUID
    senderLastName: string;
    senderFirstName: string;
    senderEmail: string;
    senderProfilePic: string;
    title: string;
    message: string;
    createdAt: string; // LocalDateTime devient string
    read: boolean;
    relatedEntityId?: number; // L'ID de la recette ou utilisateur lié à la notification
    entityType?: "user" | "recipe"; // Type d'entité (soit un user, soit une recette)
}