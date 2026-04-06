const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api';

function buildUrl(path) {
  const base = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

async function req(path, options = {}) {
  const res = await fetch(buildUrl(path), {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  get:    (path)       => req(path),
  post:   (path, body) => req(path, { method:'POST', body: JSON.stringify(body) }),
  put:    (path, body) => req(path, { method:'PUT',  body: JSON.stringify(body) }),
  delete: (path)       => req(path, { method:'DELETE' }),
};