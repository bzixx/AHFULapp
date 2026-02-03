// A JavaScript client for the Flask auth Blueprint endpoints.

import { API_URLS } from './config.js';

const API_BASE_URL = API_URLS.auth;

/**
 * Helper for handling HTTP responses.
 */
export async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message = data?.error || response.statusText;
    throw new Error(`API error (${response.status}): ${message}`);
  }

  return data;
}

/**
 * Helper for building query strings.
 */
export function toQueryString(params = {}) {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : '';
}

/**
 * Attempt login with Google token to backend.
 * @param {Object} token - Google JWT auth token.
 */
export async function google_login(google_token) {
  const url = `${API_BASE_URL}/google-login`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: google_token }),
    credentials: 'include',
  });
  return handleResponse(res);
}

export async function logout() {
    const url = `${API_BASE_URL}/logout`;
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
    });
    return handleResponse(res)
}

export async function whoami() {
    const url = `${API_BASE_URL}/whoami`;
    const res = await fetch(url, {
        method: 'GET',
        credentials: 'include'
    });
    return handleResponse(res);
}


export default {
  google_login,
  logout,
  whoami,
};
