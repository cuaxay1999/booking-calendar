import request from '../utils/axios';

export const getAppointments = () => request.get('/appoinments');

export const createAppointment = (data) => request.post('/appoinments', data);

export const searchAppointment = (keyword) => request.get('/appoinments/search', { params: { keyword } });

export const acceptAppointment = (id, data) => request.put('/appoinments/accept/' + id, data);

export const cancelAppointment = (id) => request.put('/appoinments/cancel/' + id);

export const finishAppointment = (id) => request.put('/appoinments/finish/' + id);
