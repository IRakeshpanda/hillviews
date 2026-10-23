import { getSmoobuHeaders } from '../_lib/smoobu.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.SMOOBU_API_KEY || '';
  const apiSecret = process.env.SMOOBU_API_SECRET || '';
  const customerId = Number(process.env.SMOOBU_CUSTOMER_ID || '0');
  const apartmentId = Number(process.env.SMOOBU_HILL_VIEW_APARTMENT_ID || '0');

  if (!apiKey || !customerId || !apartmentId) {
    return res.status(500).json({
      available: false,
      message: 'Smoobu availability is not configured. Set SMOOBU_API_KEY, SMOOBU_CUSTOMER_ID, and SMOOBU_HILL_VIEW_APARTMENT_ID in Vercel.'
    });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const arrivalDate = String(body.arrivalDate || '').trim();
  const departureDate = String(body.departureDate || '').trim();
  const guests = Number(body.guests || body.adults || 2);

  if (!arrivalDate || !departureDate) {
    return res.status(400).json({ available: false, message: 'Arrival and departure dates are required.' });
  }

  const start = new Date(`${arrivalDate}T00:00:00Z`);
  const end = new Date(`${departureDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
    return res.status(400).json({ available: false, message: 'Departure date must be after arrival date.' });
  }

  const payload = {
    arrivalDate,
    departureDate,
    apartments: [apartmentId],
    customerId,
    guests,
  };

  const rawBody = JSON.stringify(payload);
  const headers = getSmoobuHeaders({
    method: 'POST',
    path: '/booking/checkApartmentAvailability',
    body: rawBody,
    apiKey,
    apiSecret,
  });

  try {
    const response = await fetch('https://login.smoobu.com/booking/checkApartmentAvailability', {
      method: 'POST',
      headers,
      body: rawBody,
    });

    const responseText = await response.text();
    let data = {};
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = { raw: responseText };
    }

    console.log('Smoobu availability status:', response.status);
    console.log('Smoobu availability response:', responseText.slice(0, 1200));

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || 'Unable to verify availability for the selected dates.';
      return res.status(response.status || 500).json({
        available: false,
        message: errorMessage,
      });
    }

    const apartmentKey = String(apartmentId);
    const availableApartments = Array.isArray(data?.availableApartments)
      ? data.availableApartments.map((value) => String(value))
      : [];
    const available = availableApartments.includes(apartmentKey);
    const priceInfo = data?.prices?.[apartmentKey] || data?.prices?.[Number(apartmentId)] || {};
    const errorMessage = data?.errorMessages?.[apartmentKey]?.message || data?.errorMessages?.[Number(apartmentId)]?.message || '';

    return res.status(200).json({
      available,
      price: priceInfo?.price ?? null,
      currency: priceInfo?.currency ?? null,
      message: available ? '' : (errorMessage || data?.message || 'The selected dates are not available.'),
    });
  } catch (error) {
    console.error('Smoobu availability API error:', error);
    return res.status(500).json({
      available: false,
      message: 'We could not verify availability right now. Please try again.',
    });
  }
}
