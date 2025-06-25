import api from "@/config/api";
import { CommentDTO } from "@/types/comment";
import { AxiosError } from "axios";

interface ErrorResponse {
    status: number;
    error: string;
    message: string;
}

export const createComment = async (recipeId: number, content: string): Promise<CommentDTO> => {
    try {
        const response = await api.post("/comments", { recipeId, content });
        return response.data as CommentDTO;
    } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        if (axiosError.response) {
            const { message } = axiosError.response.data;
            throw new Error(message || "Failed to create comment");
        }
        throw new Error("Network error during comment creation");
    }
};

export const createReply = async (parentId: number, recipeId: number, content: string): Promise<CommentDTO> => {
    try {
        const response = await api.post(`/comments/${parentId}/reply`, { recipeId, content });
        return response.data as CommentDTO;
    } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        if (axiosError.response) {
            const { message } = axiosError.response.data;
            throw new Error(message || "Failed to create reply");
        }
        throw new Error("Network error during reply creation");
    }
};

export const deleteComment = async (id: number): Promise<void> => {
    try {
        await api.delete(`/comments/${id}`);
    } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        if (axiosError.response) {
            const { message } = axiosError.response.data;
            throw new Error(message || "Failed to delete comment");
        }
        throw new Error("Network error during comment deletion");
    }
};

export const fetchComments = async (recipeId: number): Promise<CommentDTO[]> => {
    try {
        const response = await api.get(`/comments/recipe/${recipeId}`);
        return response.data as CommentDTO[];
    } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        if (axiosError.response) {
            const { message } = axiosError.response.data;
            throw new Error(message || "Failed to fetch comments");
        }
        throw new Error("Network error during comments fetching");
    }
};

export const fetchCommentCount = async (recipeId: number): Promise<number> => {
    try {
        const comments = await fetchComments(recipeId);
        return comments.length;
    } catch (err) {
        return 0; // Fallback to 0 if fetching fails
    }
};