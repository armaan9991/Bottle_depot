import API from "./axios";

export const getAllTransactions = async () => {
    try {
        const response = await API.get('/api/transaction');
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
};

export const getTransactionById = async (id) => {
    try {
        const response = await API.get(`/api/transaction/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching transaction ${id}:`, error);
        throw error;
    }
};

export const getTransactionsByEmployee = async (workId) => {
    try {
        const response = await API.get(`/api/transaction/employee/${workId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching transactions for employee ${workId}:`, error);
        throw error;
    }
};

export const createTransaction = async (transactionData) => {
    try {
        const response = await API.post('/api/transaction', transactionData);
        return response.data;
    } catch (error) {
        console.error("Error creating transaction:", error);
        throw error;
    }
};