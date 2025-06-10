import {formatDate, toImageUrl} from "@/lib/utils";

export default interface CommentDTO{
    idComment : number;
    userId : string;
    recipeId : string;
    userFullName : string;
    userProfilePic : string;
    parentId : number;
    createdAt : string;
    replies : string;
    deleted : boolean;
}

export default class Comment implements CommentDTO{
    idComment : number;
    userId : string;
    recipeId : string;
    userFullName : string;
    userProfilePic : string;
    userProfileUrl : string;
    parentId : number;
    createdAt : string;
    replies : string;
    deleted : boolean;

    constructor(CommentDTO : CommentDTO) {
        this.idComment = CommentDTO.idComment;
        this.userId = CommentDTO.userId;
        this.recipeId = CommentDTO.recipeId;
        this.userFullName = CommentDTO.userFullName;
        this.userProfilePic = CommentDTO.userProfilePic;
        this.userProfileUrl = toImageUrl(CommentDTO.userProfilePic);
        this.parentId = CommentDTO.parentId;
        this.createdAt = formatDate(CommentDTO.createdAt);
        this.replies  = CommentDTO.replies;
        this.deleted  = CommentDTO.deleted;
    }
}


