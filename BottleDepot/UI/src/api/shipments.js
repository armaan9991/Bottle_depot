import API from "./axios";

// GET: /api/Shipment
export const getAllShipments = async () => {
    try {
        const response = await API.get('/api/Shipment');
        return response.data;
    } catch (error) {
        console.error("Error fetching shipments:", error);
        throw error;
    }
};

// POST: /api/Shipment (Admin only)
// Payload expects CreateShipmentRequest format
export const createShipment = async (shipmentData) => {
    try {
        const response = await API.post('/api/Shipment', shipmentData);
        return response.data;
    } catch (error) {
        console.error("Error creating shipment:", error);
        throw error;
    }
};