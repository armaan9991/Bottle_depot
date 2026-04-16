import API from "./axios";

export const getAllRecords = async () => {
    try {
        return await API.get('/api/DailyRecord');
    } catch (error) {
        console.error("Error fetching daily records:", error);
        throw error;
    }
};

export const getTodayRecord = async () => {
    try {
        return await API.get('/api/DailyRecord/today');
    } catch (error) {
        console.error("Error fetching today's record:", error);
        throw error;
    }
};
export const getRecordByDate = async (date) => {
    return await API.get(`/api/DailyRecord/date/${date}`);
};

export const getRecordById = async (id) => {
    try {
        return await API.get(`/api/DailyRecord/${id}`);
    } catch (error) {
        console.error(`Error fetching record ${id}:`, error);
        throw error;
    }
};

export const createRecord = async (recordData) => {
    try {
        return await API.post('/api/DailyRecord', recordData);
    } catch (error) {
        console.error("Error creating daily record:", error);
        throw error;
    }
};

// Controller: POST /api/DailyRecord/close  [FromBody] int recordId
export const closeRecord = async (id) => {
    try {
        return await API.post('/api/DailyRecord/close', id, {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(`Error closing record ${id}:`, error);
        throw error;
    }
};
