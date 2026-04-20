import API from "./axios";

// GET: /api/Schedule (Admin only)
export const getAllSchedules = async () => {
    try {
        const response = await API.get('/api/schedule');
        return response.data;
    } catch (error) {
        console.error("Error fetching schedules:", error);
        throw error;
    }
};

// GET: /api/Schedule/employee/{workId}
export const getScheduleByEmployee = async (workId) => {
    try {
        const response = await API.get(`/api/schedule/employee/${workId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching schedule for employee ${workId}:`, error);
        throw error;
    }
};

// POST: /api/Schedule (Admin only)
// Payload expects CreateScheduleRequest format
export const createSchedule = async (scheduleData) => {
    try {
        const response = await API.post('/api/schedule', scheduleData);
        return response.data;
    } catch (error) {
        console.error("Error creating schedule:", error);
        throw error;
    }
};