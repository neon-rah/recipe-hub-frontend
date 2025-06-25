import { formatDate, toImageUrl } from "@/lib/utils";

export interface CommentDTO {
    idComment: number;
    userId: string;
    recipeId: number;
    userFullName: string;
    userProfilePic: string;
    parentId?: number;
    content: string;
    createdAt: string;
    replies?: CommentDTO[];
    deleted: boolean;
}

export class Comment implements CommentDTO {
    idComment: number;
    userId: string;
    recipeId: number;
    userFullName: string;
    userProfilePic: string;
    userProfileUrl: string;
    parentId?: number;
    content: string;
    createdAt: string;
    replies?: CommentDTO[];
    deleted: boolean;

    constructor(commentDTO: CommentDTO) {
        this.idComment = commentDTO.idComment;
        this.userId = commentDTO.userId;
        this.recipeId = commentDTO.recipeId;
        this.userFullName = commentDTO.userFullName;
        this.userProfilePic = commentDTO.userProfilePic;
        this.userProfileUrl = toImageUrl(commentDTO.userProfilePic);
        this.parentId = commentDTO.parentId;
        this.content = commentDTO.content;
        this.createdAt = formatDate(commentDTO.createdAt);
        this.replies = commentDTO.replies || [];
        this.deleted = commentDTO.deleted;
    }
}