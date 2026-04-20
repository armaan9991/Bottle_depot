import API from "./axios";

// GET: /api/Employee
export const getAllEmployees = async () => {
    try {
        const response = await API.get('/api/employee');
        return response.data;
    } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
    }
};

// GET: /api/Employee/{id}
export const getEmployeeById = async (id) => {
    try {
        const response = await API.get(`/api/employee/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching employee ${id}:`, error);
        throw error;
    }
};

// POST: /api/Employee (Admin only)
// Payload expects CreateEmployeeRequest format
export const createEmployee = async (employeeData) => {
    try {
        const response = await API.post('/api/employee', employeeData);
        return response.data;
    } catch (error) {
        console.error("Error creating employee:", error);
        throw error;
    }
};

// PUT: /api/Employee/{id} (Admin only)
// Payload expects CreateEmployeeRequest format
export const updateEmployee = async (id, employeeData) => {
    try {
        const response = await API.put(`/api/employee/${id}`, employeeData);
        return response.data;
    } catch (error) {
        console.error(`Error updating employee ${id}:`, error);
        throw error;
    }
};