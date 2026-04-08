import API from "./axios";

export const getAllRecords = async () => {
    try {
        const response = await API.get('/api/DailyRecord');
        return response.data;
    } catch (error) {
        console.error("Error fetching daily records:", error);
        throw error;
    }
};

export const getTodayRecord = async () => {
    try {
        const response = await API.get('/api/DailyRecord/today');
        return response;
    } catch (error) {
        console.error("Error fetching today's record:", error);
        throw error;
    }
};

export const getRecordById = async (id) => {
    try {
        const response = await API.get(`/api/DailyRecord/${id}`);
        return response;
    } catch (error) {
        console.error(`Error fetching record ${id}:`, error);
        throw error;
    }
};

export const createRecord = async (recordData) => {
    try {
        const response = await API.post('/api/DailyRecord', recordData);
        return response;
    } catch (error) {
        console.error("Error creating daily record:", error);
        throw error;
    }
};

export const closeRecord = async (id) => {
    try {
        const response = await API.put(`/api/DailyRecord/${id}/close`);
        return response;
    } catch (error) {
        console.error(`Error closing record ${id}:`, error);
        throw error;
    }
};