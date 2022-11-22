import request from '../utils/axios';

export const loginApi = (user) => request.post('/auth/login', user);

export const getInfo = () => request.get('/users/me');
