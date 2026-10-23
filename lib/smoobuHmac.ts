import crypto from 'crypto';

export function buildSmoobuHeaders(
  method: string,
  path: string,
  body: string,
  apiKey: string,
  apiSecret: string,
) {
  const timestamp = new Date().toISOString();
  const nonce = crypto.randomUUID();
  const canonical = [method.toUpperCase(), path, timestamp, nonce, body ?? ''].join('\n');
  const signature = crypto
    .createHmac('sha256', Buffer.from(apiSecret, 'base64'))
    .update(canonical)
    .digest('hex');

  return {
    'X-API-Key': apiKey,
    'X-Timestamp': timestamp,
    'X-Nonce': nonce,
    'X-Signature': signature,
  };
}
