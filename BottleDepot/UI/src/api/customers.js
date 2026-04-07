import API from "./axios";

export const getAllCustomers = async () => {
    try {
        const response = await API.get('/api/Customer');
        return response;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
};

export const getCustomerById = async (id) => {
    try {
        const response = await API.get(`/api/Customer/${id}`);
        return response;
    } catch (error) {
        console.error(`Error fetching customer ${id}:`, error);
        throw error;
    }
};

export const createCustomer = async (customerData) => {
    try {
        console.log(customerData);
        const response = await API.post('/api/Customer', customerData);
        console.log(response)
        return response;
    } catch (error) {
        console.error("Error creating customer:", error);
        throw error;
    }
};

export const updateCustomer = async (id, customerData) => {
    try {
        const response = await API.put(`/api/Customer/${id}`, customerData);
        return response;
    } catch (error) {
        console.error(`Error updating customer ${id}:`, error);
        throw error;
    }
};