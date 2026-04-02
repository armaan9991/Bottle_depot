import API from "./axios";

export const loginUser = async (workId, password) => {
    try {
        const response = await API.post('/api/auth/login', {
            WorkId: workId,
            Password: password
        });


        if (response.data.token) {
            localStorage.setItem('jwt_token', response.data.token);
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};


export const logoutUser = () => {
    localStorage.removeItem('jwt_token');
};