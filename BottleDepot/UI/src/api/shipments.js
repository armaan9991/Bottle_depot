import API from "./axios";

// GET: /api/Shipment
export const getAllShipments = async () => {
    try {
        return await API.get('/api/shipment');      // returns full axios response → caller uses .data
    } catch (error) {
        console.error("Error fetching shipments:", error);
        throw error;
    }
};

// POST: /api/Shipment (Admin only)
export const createShipment = async (shipmentData) => {
    try {
        return await API.post('/api/shipment', shipmentData);
    } catch (error) {
        console.error("Error creating shipment:", error);
        throw error;
    }
};

export const getAllCompanies = async () => {
    try {
        return await API.get('/api/shipment/companies');
    } catch (error) {
        console.error("Error fetching companies:", error);
        throw error;
    }
};
