import { getNightlyAvailability } from './_lib/smoobu.js';

function toIsoDateString(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function parseIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : value;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  try {
    const from = parseIsoDate(String(req.query?.from || ''));
    const to = parseIsoDate(String(req.query?.to || ''));

    if (!from || !to) {
      return res.status(400).json({ error: 'availability_unavailable' });
    }

    const start = new Date(`${from}T00:00:00Z`);
    const end = new Date(`${to}T00:00:00Z`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ error: 'availability_unavailable' });
    }

    const maxSpanMs = 400 * 24 * 60 * 60 * 1000;
    if (end.getTime() - start.getTime() > maxSpanMs) {
      return res.status(400).json({ error: 'availability_unavailable' });
    }

    const days = await getNightlyAvailability(from, to);
    if (!days || typeof days !== 'object' || Array.isArray(days)) {
      return res.status(502).json({ error: 'availability_unavailable' });
    }

    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
    return res.status(200).json({ days });
  } catch (error) {
    return res.status(502).json({ error: 'availability_unavailable' });
  }
}
