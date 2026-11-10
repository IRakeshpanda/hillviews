import crypto from 'node:crypto';

function encodeRfc3986(value) {
  return encodeURIComponent(String(value)).replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
}

export function buildCanonicalQueryString(query) {
  if (!query) return '';

  const entries = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((item) => [`${String(key)}[]`, String(item)]);
      }
      return [[String(key), String(value)]];
    })
    .flat();

  entries.sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));

  return entries
    .map(([key, value]) => `${encodeRfc3986(key)}=${encodeRfc3986(value)}`)
    .join('&');
}

export function listNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return [];

  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
    return [];
  }

  const nights = [];
  const cursor = new Date(start);
  while (cursor < end) {
    const iso = new Date(cursor.getTime() - cursor.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    nights.push(iso);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return nights;
}

export function getSmoobuHeaders({ method, path, query, body, apiKey, apiSecret }) {
  const rawBody = body == null ? '' : (typeof body === 'string' ? body : JSON.stringify(body));
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const nonce = crypto.randomUUID();
  const hash = crypto.createHash('sha256').update(rawBody || '').digest('hex');
  const canonicalQuery = typeof query === 'string' ? query : buildCanonicalQueryString(query || {});
  const requestPath = `${path || '/'}${canonicalQuery ? `?${canonicalQuery}` : ''}`;

  const canonical = [
    method.toUpperCase(),
    requestPath,
    timestamp,
    nonce,
    hash,
    apiKey || '',
  ].join('\n');

  if (!apiSecret) {
    return {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
      'X-API-Key': apiKey,
    };
  }

  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(canonical)
    .digest('base64');

  return {
    'Content-Type': 'application/json',
    'Api-Key': apiKey,
    'X-API-Key': apiKey,
    'X-Timestamp': timestamp,
    'X-Nonce': nonce,
    'X-Signature': signature,
  };
}

export async function checkApartmentAvailability({ apartmentId, arrivalDate, departureDate, guests = 2, customerId = Number(process.env.SMOOBU_CUSTOMER_ID || '0') }) {
  const apiKey = process.env.SMOOBU_API_KEY || '';
  const apiSecret = process.env.SMOOBU_API_SECRET || '';

  if (!apiKey || !apiSecret || !apartmentId) {
    throw new Error('Smoobu availability is not configured.');
  }

  const payload = {
    arrivalDate,
    departureDate,
    apartments: [apartmentId],
    customerId,
    guests,
  };

  const body = JSON.stringify(payload);
  const headers = getSmoobuHeaders({
    method: 'POST',
    path: '/booking/checkApartmentAvailability',
    body,
    apiKey,
    apiSecret,
  });

  const response = await fetch('https://login.smoobu.com/booking/checkApartmentAvailability', {
    method: 'POST',
    headers,
    body,
  });

  const responseText = await response.text();
  let data = {};
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = { raw: responseText };
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Unable to verify availability.');
  }

  return data;
}

function toPlainNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const output = Number(value);
  return Number.isFinite(output) ? output : null;
}

function londonDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = {};
  for (const part of parts) {
    if (part.type !== 'literal') values[part.type] = part.value;
  }
  return `${values.year}-${values.month}-${values.day}`;
}

export async function getNightlyAvailability(startDate, endDate) {
  const apiKey = process.env.SMOOBU_API_KEY || '';
  const apiSecret = process.env.SMOOBU_API_SECRET || '';
  const apartmentId = Number(process.env.SMOOBU_HILL_VIEW_APARTMENT_ID || '0');

  if (!apiKey || !apiSecret || !apartmentId) {
    throw new Error('Smoobu availability is not configured.');
  }

  const rateQuery = {
    apartments: [apartmentId],
    start_date: startDate,
    end_date: endDate,
  };
  const rateUrl = `https://login.smoobu.com/api/rates?${buildCanonicalQueryString(rateQuery)}`;
  const rateHeaders = getSmoobuHeaders({
    method: 'GET',
    path: '/api/rates',
    query: rateQuery,
    apiKey,
    apiSecret,
  });

  let ratesResponse;
  let ratesText = '';
  try {
    ratesResponse = await fetch(rateUrl, { method: 'GET', headers: rateHeaders });
    ratesText = await ratesResponse.text();
    if (!ratesResponse.ok) {
      console.error('Smoobu rates request failed', { status: ratesResponse.status, body: ratesText.slice(0, 300) });
      throw new Error('Smoobu rate lookup failed.');
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Smoobu rate lookup failed.') {
      throw error;
    }
    console.error('Smoobu rates request failed', { status: 500, body: String(error).slice(0, 300) });
    throw new Error('Smoobu rate lookup failed.');
  }

  let ratesData = {};
  try {
    ratesData = ratesText ? JSON.parse(ratesText) : {};
  } catch {
    throw new Error('Smoobu rate lookup failed.');
  }

  const reservationDays = new Map();
  let currentPage = 1;
  let hasMore = true;
  while (hasMore) {
    const reservationQuery = {
      apartmentId,
      from: startDate,
      to: endDate,
      pageSize: 100,
      page: currentPage,
    };
    const reservationUrl = `https://login.smoobu.com/api/reservations?${buildCanonicalQueryString(reservationQuery)}`;
    const reservationHeaders = getSmoobuHeaders({
      method: 'GET',
      path: '/api/reservations',
      query: reservationQuery,
      apiKey,
      apiSecret,
    });

    const reservationResponse = await fetch(reservationUrl, { method: 'GET', headers: reservationHeaders });
    const reservationText = await reservationResponse.text();

    if (!reservationResponse.ok) {
      console.error('Smoobu reservations request failed', { status: reservationResponse.status, body: reservationText.slice(0, 300) });
      throw new Error('Smoobu reservation lookup failed.');
    }

    let reservationData = {};
    try {
      reservationData = reservationText ? JSON.parse(reservationText) : {};
    } catch {
      throw new Error('Smoobu reservation lookup failed.');
    }

    const records = Array.isArray(reservationData?.data) ? reservationData.data : Array.isArray(reservationData) ? reservationData : [];
    for (const reservation of records) {
      const type = String(reservation?.type || '').toLowerCase();
      if (type === 'cancellation') continue;

      const arrival = reservation?.arrivalDate || reservation?.arrival_date || reservation?.checkIn || reservation?.check_in || reservation?.dateFrom || reservation?.from;
      const departure = reservation?.departureDate || reservation?.departure_date || reservation?.checkOut || reservation?.check_out || reservation?.dateTo || reservation?.to;
      if (!arrival || !departure) continue;

      for (const night of listNights(arrival, departure)) {
        reservationDays.set(night, true);
      }
    }

    const pagination = reservationData?.pagination || reservationData?.meta || {};
    const totalPages = Number(pagination?.totalPages || pagination?.total_pages || 0);
    hasMore = totalPages > currentPage && records.length > 0;
    currentPage += 1;
    if (currentPage > 50) hasMore = false;
  }

  const result = {};
  const dateRange = listNights(startDate, endDate);
  const apartmentRates = ratesData?.data?.[String(apartmentId)] || ratesData?.[String(apartmentId)] || {};

  for (const night of dateRange) {
    const rateEntry = apartmentRates[night] || {};
    const available = Boolean(rateEntry.available === 1 || rateEntry.available === true || rateEntry.available === '1') && !reservationDays.has(night);
    result[night] = {
      available,
      price: toPlainNumber(rateEntry.price),
      minStay: Math.max(1, Number(rateEntry.min_length_of_stay || rateEntry.minStay || 1)),
    };
  }

  return result;
}

export async function assertBookable({ apartmentId, arrivalDate, departureDate, guests = 2, customerId = Number(process.env.SMOOBU_CUSTOMER_ID || '0') }) {
  if (!arrivalDate || !departureDate) {
    throw new Error('Arrival and departure dates are required.');
  }

  const todayInLondon = londonDateString(new Date());
  if (arrivalDate <= todayInLondon) {
    throw new Error('Check-in must be after today.');
  }

  if (arrivalDate >= departureDate) {
    throw new Error('Check-out must be after check-in.');
  }

  const availability = await getNightlyAvailability(arrivalDate, departureDate);
  const nights = listNights(arrivalDate, departureDate);
  const requiredMinStay = nights.reduce((max, day) => Math.max(max, availability[day]?.minStay || 1), 1);

  if (nights.length < requiredMinStay) {
    throw new Error('The stay does not meet the minimum length of stay.');
  }

  for (const night of nights) {
    const info = availability[night];
    if (!info || info.available !== true) {
      throw new Error('One or more selected nights are unavailable.');
    }
  }

  const availabilityResponse = await checkApartmentAvailability({ apartmentId, arrivalDate, departureDate, guests, customerId });
  const apartmentKey = String(apartmentId);
  const availableApartments = Array.isArray(availabilityResponse?.availableApartments) ? availabilityResponse.availableApartments.map((value) => String(value)) : [];
  if (!availableApartments.includes(apartmentKey)) {
    throw new Error(availabilityResponse?.errorMessages?.[apartmentKey]?.message || availabilityResponse?.errorMessages?.[Number(apartmentId)]?.message || 'The selected dates are not available.');
  }
}

