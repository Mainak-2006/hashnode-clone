/**
 * Turn an Axios error into a human-readable message.
 */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;

  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'The request timed out. Please try again.';
    }
    return 'Cannot reach the server. Is the API running?';
  }

  const { data, status } = error.response;

  if (data?.errors) {
    if (Array.isArray(data.errors)) return data.errors.join(' ');
    if (typeof data.errors === 'string') return data.errors;
  }

  if (data?.message) return data.message;

  if (status === 401) return 'Your session has expired. Please log in again.';
  if (status === 403) return 'You do not have permission to do that.';
  if (status === 404) return 'We could not find what you were looking for.';
  if (status >= 500) return 'The server ran into a problem. Please try again.';

  return fallback;
}

export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
