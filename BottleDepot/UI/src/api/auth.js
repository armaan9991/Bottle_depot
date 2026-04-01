import Login from "../pages/Login";
import API from "./axios";

import API from "./axios";

export const loginUser = async (workId, password) => {
    try {
        const response = await API.post('/api/auth/login', {
            WorkId: workId,
            Password: password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};