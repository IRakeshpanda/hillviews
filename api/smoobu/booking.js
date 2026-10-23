export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.SMOOBU_API_KEY || process.env.textSMOOBU_API_KEY || '';
  const apiSecret = process.env.SMOOBU_API_SECRET || '';
  const apartmentId = process.env.SMOOBU_HILL_VIEW_APARTMENT_ID || '';

  if (!apiKey || !apiSecret || !apartmentId) {
    return res.status(500).json({
      error: 'Smoobu environment variables are missing. Set SMOOBU_API_KEY, SMOOBU_API_SECRET, and SMOOBU_HILL_VIEW_APARTMENT_ID in Vercel.'
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

    const availabilityUrl = new URL('https://login.smoobu.com/api/rates');
    availabilityUrl.searchParams.set('apartments[]', apartmentId);
    availabilityUrl.searchParams.set('start_date', String(arrivalDate));
    availabilityUrl.searchParams.set('end_date', String(departureDate));

    const availabilityResponse = await fetch(availabilityUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
    });

    if (!availabilityResponse.ok) {
      const detail = await availabilityResponse.text();
      console.error('Smoobu availability check failed for booking request', {
        status: availabilityResponse.status,
        detail,
      });
      return res.status(502).json({
        error: 'Unable to verify availability for the selected dates. Please try another date range.'
      });
    }

    const availabilityData = await availabilityResponse.json();
    const apartmentData = availabilityData?.data?.[apartmentId] ?? availabilityData?.[apartmentId] ?? {};
    const bookedDates = Object.entries(apartmentData)
      .filter(([, details]) => details?.available === 0 || details?.available === false)
      .map(([date]) => date);

    const start = new Date(`${arrivalDate}T00:00:00Z`);
    const end = new Date(`${departureDate}T00:00:00Z`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      return res.status(400).json({ error: 'Check-in must be before check-out.' });
    }

    let cursor = new Date(start);
    while (cursor < end) {
      const iso = cursor.toISOString().slice(0, 10);
      if (bookedDates.includes(iso)) {
        return res.status(409).json({ error: 'The selected dates overlap with an unavailable period. Please choose another range.' });
      }
      cursor.setUTCDate(cursor.getUTCDate() + 1);
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

    const reservationResponse = await fetch('https://login.smoobu.com/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const text = await reservationResponse.text();
    let parsed = {};
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      parsed = { raw: text };
    }

    if (!reservationResponse.ok) {
      console.error('Smoobu reservation creation failed', {
        status: reservationResponse.status,
        payload: parsed,
      });
      return res.status(reservationResponse.status || 500).json({
        error: parsed?.message || 'Your booking request could not be submitted. Please try again.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Your booking request has been received.',
      booking: parsed,
      reference: parsed?.id || parsed?.reservationId || parsed?.bookingId || null,
    });
  } catch (error) {
    console.error('Booking API error:', error);
    return res.status(500).json({
      error: 'Something went wrong while sending your booking request.'
    });
  }
}
