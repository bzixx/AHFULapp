// reportsApi.js
// A JavaScript client for the Flask reports Blueprint endpoints.

import { API_URLS } from './config.js';

const API_BASE_URL = API_URLS.reports;

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
 * Query reports (optionally filtered by query parameters).
 * @param {Object} filters - Optional query parameters.
 * @param {string} [token] - Optional auth token.
 */
export async function queryReports(filters = {}, token = null) {
  const url = `${API_BASE_URL}/query${toQueryString(filters)}`;
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  return handleResponse(res);
}

/**
 * Create (generate) a new report.
 * The Flask backend automatically generates the report; no payload required.
 * @param {string} [token] - Optional auth token.
 */
export async function createReport(token = null) {
  const res = await fetch(`${API_BASE_URL}/create`, {
    method: 'POST',
    credentials: 'include',
  });
  return handleResponse(res);
}

/**
 * Delete a report by its MongoDB document _id.
 * @param {string} documentId - The report _id.
 * @param {string} [token] - Optional auth token.
 */
export async function deleteReport(documentId, token = null) {
  const res = await fetch(`${API_BASE_URL}/delete/${documentId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse(res);
}

export default {
  queryReports,
  createReport,
  deleteReport,
};
