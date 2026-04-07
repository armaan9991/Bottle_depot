import API from "./axios";

export const getAllContainerTypes = async () => {
    try {
        const response = await API.get('/api/ContainerType');
        return response;
    } catch (error) {
        console.error("Error fetching container types:", error);
        throw error;
    }
};

export const getContainerTypeById = async (id) => {
    try {
        const response = await API.get(`/api/ContainerType/${id}`);
        return response;
    } catch (error) {
        console.error(`Error fetching container type ${id}:`, error);
        throw error;
    }
};

export const createContainerType = async (data) => {
    try {
        const response = await API.post('/api/ContainerType', data);
        return response;
    } catch (error) {
        console.error("Error creating container type:", error);
        throw error;
    }
};

export const updateContainerType = async (id, data) => {
    try {
        const response = await API.put(`/api/ContainerType/${id}`, data);
        return response;
    } catch (error) {
        console.error(`Error updating container type ${id}:`, error);
        throw error;
    }
};