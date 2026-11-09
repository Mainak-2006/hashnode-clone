import api from './axios';

export const getUserProfile = (id, params = {}, options = {}) =>
  api.get(`/users/${id}`, { params, ...options }).then((response) => response.data);

export const updateMyProfile = (payload) =>
  api.put('/users/me', payload).then((response) => response.data);
