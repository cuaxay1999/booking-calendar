import request from '../utils/axios';

export const getUsers = () => request.get('/users');

export const getTypeUser = () => request.get('/users/type-user');

export const createUser = (user) => request.post('/users', user);

export const activeUser = (id) => request.put(`/users/active/${id}`);

export const deActiveUser = (id) => request.put(`/users/de-active/${id}`);
