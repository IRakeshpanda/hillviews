import crypto from 'node:crypto';

function encodeRfc3986(value) {
  return encodeURIComponent(String(value)).replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
}

export function buildCanonicalQueryString(query) {
  if (!query) return '';

  const entries = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => [String(key), Array.isArray(value) ? value.map((item) => String(item)) : String(value)]);

  const normalized = [];
  for (const [key, value] of entries) {
    if (Array.isArray(value)) {
      for (const item of value) {
        normalized.push([key, item]);
      }
    } else {
      normalized.push([key, value]);
    }
  }

  normalized.sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));

  return normalized
    .map(([key, value]) => `${encodeRfc3986(key)}=${encodeRfc3986(value)}`)
    .join('&');
}

export function getSmoobuHeaders({ method, path, query, body, apiKey, apiSecret }) {
  const rawBody = typeof body === 'string' ? body : JSON.stringify(body ?? {});
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const nonce = crypto.randomUUID();
  const hash = crypto.createHash('sha256').update(rawBody || '').digest('hex');
  const canonicalQuery = typeof query === 'string' ? query : buildCanonicalQueryString(query || {});

  const canonical = [
    method.toUpperCase(),
    path || '/',
    canonicalQuery,
    timestamp,
    nonce,
    hash,
    apiKey || '',
  ].join('\n');

  if (!apiSecret) {
    return {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
    };
  }

  const signature = Buffer.from(
    crypto.createHmac('sha256', apiSecret).update(canonical).digest()
  ).toString('base64');

  return {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey,
    'X-Timestamp': timestamp,
    'X-Nonce': nonce,
    'X-Signature': signature,
  };
}
