import API from './axios';

export const createLabel = (data) =>
    API.post('/api/label', data);

export const getAllLabels = () =>
    API.get('/api/label');

export const processLabel = (labelId) =>
    API.post('/api/label/process', labelId, {
        headers: { 'Content-Type': 'application/json' }
    });