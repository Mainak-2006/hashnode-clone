import api from './axios';

export const listPosts = (params = {}, options = {}) =>
  api.get('/posts', { params, ...options }).then((response) => response.data);

export const getPostBySlug = (slug, options = {}) =>
  api.get(`/posts/${encodeURIComponent(slug)}`, options).then((response) => response.data);

export const getMyPosts = (params = {}, options = {}) =>
  api.get('/posts/mine', { params, ...options }).then((response) => response.data);

export const getMyPostById = (id, options = {}) =>
  api.get(`/posts/id/${id}`, options).then((response) => response.data);

export const createPost = (payload) =>
  api.post('/posts', payload).then((response) => response.data);

export const updatePost = (id, payload) =>
  api.put(`/posts/${id}`, payload).then((response) => response.data);

export const deletePost = (id) =>
  api.delete(`/posts/${id}`).then((response) => response.data);
