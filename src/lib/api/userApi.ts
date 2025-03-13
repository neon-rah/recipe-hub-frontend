import api from "@/config/api";
import {User} from "@/types/user";


export const getUserById = async (userId: string): Promise<User> => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
};