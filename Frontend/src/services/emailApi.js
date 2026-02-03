// emailApi.js
// A JavaScript client for the Flask email Blueprint endpoints.

import { API_URLS } from './config.js';

const API_BASE_URL = API_URLS.email;

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
 * Send an email (optionally with an attachment).
 * The Flask endpoint expects form fields: subject, recipient, body, and optionally `attachment`.
 * @param {Object} emailData - { subject, recipient, body, attachment }
 * @param {File} [emailData.attachment] - Optional File object to upload
 * @param {string} [token] - Optional JWT or session token
 */
export async function sendEmail(emailData, token = null) {
  const { subject, recipient, body, attachment } = emailData;

  // Build FormData to match Flask's request.form / request.files expectations
  const formData = new FormData();
  formData.append('subject', subject);
  formData.append('recipient', recipient);
  formData.append('body', body);

  if (attachment) {
    formData.append('attachment', attachment);
  }

  const res = await fetch(`${API_BASE_URL}/send`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  return handleResponse(res);
}

export default {
  sendEmail,
};
