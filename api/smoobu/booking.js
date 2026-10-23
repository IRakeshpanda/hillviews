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
      error: 'Smoobu booking is not configured. Set SMOOBU_API_KEY, SMOOBU_API_SECRET, SMOOBU_CUSTOMER_ID, and SMOOBU_HILL_VIEW_APARTMENT_ID in Vercel.'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const {
      arrivalDate,
      departureDate,
      firstName,
      lastName,
      email,
      phone,
      adults,
      children,
      notice,
    } = body;

    if (!arrivalDate || !departureDate || !firstName || !lastName || !email || !phone || !adults) {
      return res.status(400).json({ error: 'Please complete all required booking fields.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (Number(adults) < 1) {
      return res.status(400).json({ error: 'At least one adult is required.' });
    }

    const start = new Date(`${arrivalDate}T00:00:00Z`);
    const end = new Date(`${departureDate}T00:00:00Z`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ error: 'Check-in must be before check-out.' });
    }

    const availabilityPayload = {
      arrivalDate,
      departureDate,
      apartments: [apartmentId],
      customerId,
      guests: Number(adults),
    };
    const availabilityBody = JSON.stringify(availabilityPayload);
    const availabilityHeaders = getSmoobuHeaders({
      method: 'POST',
      path: '/booking/checkApartmentAvailability',
      body: availabilityBody,
      apiKey,
      apiSecret,
    });

    const availabilityResponse = await fetch('https://login.smoobu.com/booking/checkApartmentAvailability', {
      method: 'POST',
      headers: availabilityHeaders,
      body: availabilityBody,
    });

    const availabilityText = await availabilityResponse.text();
    let availabilityData = {};
    try {
      availabilityData = availabilityText ? JSON.parse(availabilityText) : {};
    } catch {
      availabilityData = { raw: availabilityText };
    }

    console.log('Smoobu availability check before booking status:', availabilityResponse.status);
    console.log('Smoobu availability check before booking response:', availabilityText.slice(0, 1200));

    if (!availabilityResponse.ok) {
      const availabilityMessage = availabilityData?.message || 'Unable to verify availability for the selected dates.';
      return res.status(availabilityResponse.status || 502).json({
        error: availabilityMessage,
      });
    }

    const apartmentKey = String(apartmentId);
    const availableApartments = Array.isArray(availabilityData?.availableApartments)
      ? availabilityData.availableApartments.map((value) => String(value))
      : [];
    const isAvailable = availableApartments.includes(apartmentKey);
    if (!isAvailable) {
      const availabilityMessage = availabilityData?.errorMessages?.[apartmentKey]?.message || availabilityData?.errorMessages?.[Number(apartmentId)]?.message || 'The selected dates are not available.';
      return res.status(409).json({ error: availabilityMessage });
    }

    const payload = {
      arrivalDate,
      departureDate,
      apartmentId,
      channelId: 70,
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      adults: Number(adults),
      children: Number(children || 0),
      notice: String(notice || '').trim(),
    };

    const reservationBody = JSON.stringify(payload);
    const reservationHeaders = getSmoobuHeaders({
      method: 'POST',
      path: '/api/reservations',
      body: reservationBody,
      apiKey,
      apiSecret,
    });

    const reservationResponse = await fetch('https://login.smoobu.com/api/reservations', {
      method: 'POST',
      headers: reservationHeaders,
      body: reservationBody,
    });

    const reservationText = await reservationResponse.text();
    let parsedReservation = {};
    try {
      parsedReservation = reservationText ? JSON.parse(reservationText) : {};
    } catch {
      parsedReservation = { raw: reservationText };
    }

    console.log('Smoobu booking status:', reservationResponse.status);
    console.log('Smoobu booking response:', reservationText.slice(0, 1200));

    if (!reservationResponse.ok) {
      return res.status(reservationResponse.status || 500).json({
        error: parsedReservation?.message || 'Your booking request could not be submitted. Please try again.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Your booking request has been received.',
      booking: parsedReservation,
      reference: parsedReservation?.id || parsedReservation?.reservationId || parsedReservation?.bookingId || null,
    });
  } catch (error) {
    console.error('Booking API error:', error);
    return res.status(500).json({
      error: 'Something went wrong while sending your booking request.'
    });
  }
}
