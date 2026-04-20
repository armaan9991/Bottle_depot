import API from "./axios";

export const getAllRecords = async () => {
    try {
        return await API.get('/api/dailyrecord');
    } catch (error) {
        console.error("Error fetching daily records:", error);
        throw error;
    }
};

export const getTodayRecord = async () => {
    try {
        return await API.get('/api/dailyrecord/today');
    } catch (error) {
        console.error("Error fetching today's record:", error);
        throw error;
    }
};
export const getRecordByDate = async (date) => {
    return await API.get(`/api/dailyrecord/date/${date}`);
};

export const getRecordById = async (id) => {
    try {
        return await API.get(`/api/dailyrecord/${id}`);
    } catch (error) {
        console.error(`Error fetching record ${id}:`, error);
        throw error;
    }
};

export const createRecord = async (recordData) => {
    try {
        return await API.post('/api/dailyrecord', recordData);
    } catch (error) {
        console.error("Error creating daily record:", error);
        throw error;
    }
};

// Controller: POST /api/DailyRecord/close  [FromBody] int recordId
export const closeRecord = async (id) => {
    try {
        return await API.post('/api/dailyrecord/close', id, {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(`Error closing record ${id}:`, error);
        throw error;
    }
};
