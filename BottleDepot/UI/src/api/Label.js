import API from './axios';

export const createLabel = (data) =>
    API.post('/api/Label', data);

export const getAllLabels = () =>
    API.get('/api/Label');

export const processLabel = (labelId) =>
    API.post('/api/Label/process', labelId, {
        headers: { 'Content-Type': 'application/json' }
    });