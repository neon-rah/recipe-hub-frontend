

export interface NotificationDTO {
    idNotif: number;
    idUser : string;
    senderId: string; // UUID
    senderLastName: string;
    senderFirstName: string;
    senderEmail: string;
    senderProfilePic: string;
    title: string;
    message: string;
    createdAt: string; // LocalDateTime devient string
    read: boolean;
    seen:boolean;
    relatedEntityId?: number|null; // L'ID de la recette ou utilisateur lié à la notification
    entityType?: "user" | "recipe"; // Type d'entité (soit un user, soit une recette)
}

export class Notification implements NotificationDTO{
    createdAt: string;
    entityType?: "user" | "recipe";
    idNotif: number;
    idUser: string;
    message: string;
    read: boolean;
    seen:boolean;
    relatedEntityId?: number | null;
    senderEmail: string;
    senderFirstName: string;
    senderId: string;
    senderLastName: string;
    senderProfilePic: string;
    senderProfileUrl: string;    
    title: string;
    userName:string;


    constructor(notif: NotificationDTO) {
        this.createdAt = notif.createdAt;
        this.entityType = notif.entityType;
        this.idNotif = notif.idNotif;
        this.idUser = notif.idUser;
        this.message = notif.message;
        this.read = notif.read;
        this.seen = notif.seen;
        this.relatedEntityId = notif.relatedEntityId;
        this.senderEmail = notif.senderEmail;
        this.senderFirstName = notif.senderFirstName;
        this.senderId = notif.senderId;
        this.senderLastName = notif.senderLastName;
        this.senderProfilePic = notif.senderProfilePic;
        this.title = notif.title;
        this.senderProfileUrl = this.senderProfilePic
            ? `${process.env.NEXT_PUBLIC_SERVER_URL}${this.senderProfilePic}`
            : "/assets/profile-1.png";
        this.userName = this.senderFirstName
            ? `${this.senderFirstName} ${this.senderLastName}`
            : this.senderLastName;
    }
}