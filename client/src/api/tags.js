import api from './axios';

export const listTags = (options = {}) =>
  api.get('/tags', options).then((response) => response.data);

export const getTagPosts = (slug, params = {}, options = {}) =>
  api
    .get(`/tags/${encodeURIComponent(slug)}/posts`, { params, ...options })
    .then((response) => response.data);
