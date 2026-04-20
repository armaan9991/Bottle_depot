import API from "./axios";

export const loginUser = async (workId, password) => {
    try {
        const response = await API.post('/api/auth/login', {
            WorkID:parseInt(workId),
            Password: password
        });


         console.log("LOGIN RESPONSE:", response.data);

        if (response.data.token) {
            localStorage.setItem('jwt_token', response.data.token);
            localStorage.setItem('user', JSON.stringify({             // ✅ save user info separately
                workId: response.data.workId,
                name: response.data.name,
                role: response.data.role,
            }));
            console.log("TOKEN SAVED AFTER LOGIN:", localStorage.getItem("jwt_token"));
        }

        // localStorage.setItem('user', JSON.stringify(response.data.token));
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const logoutUser = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
};