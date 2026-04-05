import API from "./axios";

export const getAllTransactions = async () => {
    try {
        const response = await API.get('/api/Transaction');
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
};

export const getTransactionById = async (id) => {
    try {
        const response = await API.get(`/api/Transaction/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching transaction ${id}:`, error);
        throw error;
    }
};

export const getTransactionsByEmployee = async (workId) => {
    try {
        const response = await API.get(`/api/Transaction/employee/${workId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching transactions for employee ${workId}:`, error);
        throw error;
    }
};

export const createTransaction = async (transactionData) => {
    try {
        const response = await API.post('/api/Transaction', transactionData);
        return response.data;
    } catch (error) {
        console.error("Error creating transaction:", error);
        throw error;
    }
};