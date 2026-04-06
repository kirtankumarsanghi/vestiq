const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api';

function buildUrl(path) {
  const normalizedBase = BASE_URL.endsWith('/')
    ? BASE_URL.slice(0, -1)
    : BASE_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(buildUrl(path), {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
      signal: controller.signal,
      cache: 'no-store',
    });

    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const message = payload?.message || `Request failed with status ${response.status}`;
      throw new Error(message);
    }

    return payload;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  get(path) {
    return request(path);
  },
  post(path, body) {
    return request(path, { method: 'POST', body: JSON.stringify(body) });
  },
  put(path, body) {
    return request(path, { method: 'PUT', body: JSON.stringify(body) });
  },
  delete(path) {
    return request(path, { method: 'DELETE' });
  },
};