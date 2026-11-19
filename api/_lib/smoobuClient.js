import { getSmoobuHeaders } from './smoobu.js';
import { resolvePropertyConfig } from './properties.js';
import { buildAvailabilityResponse, normalizeBlockedRanges, dateRangeOverlaps } from './availability.js';

const SMOOBU_API_HOST = 'https://login.smoobu.com';

function readJsonSafely(rawText) {
  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText);
  } catch {
    return { raw: rawText };
  }
}

function extractBlockedRangesFromPayload(payload, apartmentId) {
  const candidateCollections = [
    payload?.blockedRanges,
    payload?.result?.blockedRanges,
    payload?.result?.bookedRanges,
    payload?.availability?.blockedRanges,
    payload?.data?.blockedRanges,
    payload?.data?.[apartmentId]?.blockedRanges,
    payload?.data?.[apartmentId]?.bookedRanges,
  ];

  for (const collection of candidateCollections) {
    if (Array.isArray(collection) && collection.length > 0) {
      return normalizeBlockedRanges(collection);
    }
  }

  const dateMap = payload?.data?.[apartmentId] || payload?.result?.dates || payload?.dates || {};
  if (typeof dateMap === 'object') {
    return Object.entries(dateMap)
      .filter(([, details]) => details && (details.available === false || details.available === 0 || details.booked === true))
      .map(([date]) => ({ from: date, to: date }));
  }

  return [];
}

function getCredentialSet() {
  const apiKey = process.env.SMOOBU_API_KEY || '';
  const apiSecret = process.env.SMOOBU_API_SECRET || '';

  if (!apiKey || !apiSecret) {
    throw new Error('SMOOBU_API_KEY and SMOOBU_API_SECRET must be defined in the server environment.');
  }

  return { apiKey, apiSecret };
}

export async function fetchPropertyAvailability(propertySlug, checkIn, checkOut) {
  const config = resolvePropertyConfig(propertySlug);

  if (!config.ok || !config.apartmentId) {
    throw new Error(config.error || 'Property mapping is incomplete.');
  }

  const { apiKey, apiSecret } = getCredentialSet();

  const requestBody = JSON.stringify({
    arrivalDate: checkIn,
    departureDate: checkOut,
    apartments: [config.apartmentId],
    customerId: process.env.SMOOBU_CUSTOMER_ID || '',
    guests: 2,
  });

  const response = await fetch(`${SMOOBU_API_HOST}/booking/checkApartmentAvailability`, {
    method: 'POST',
    headers: getSmoobuHeaders({
      method: 'POST',
      path: '/booking/checkApartmentAvailability',
      body: requestBody,
      apiKey,
      apiSecret,
    }),
    body: requestBody,
  });

  const text = await response.text();
  const payload = readJsonSafely(text);

  if (!response.ok) {
    const message = payload?.message || payload?.error || payload?.detail || 'Smoobu availability check failed.';
    throw new Error(message);
  }

  const blockedRanges = extractBlockedRangesFromPayload(payload, config.apartmentId);
  const hasOverlap = blockedRanges.some((range) => dateRangeOverlaps(checkIn, checkOut, range.from, range.to));

  return {
    propertySlug: config.slug,
    isAvailable: !hasOverlap,
    blockedRanges,
    message: hasOverlap ? 'The selected dates overlap with an existing reservation.' : 'Available for the selected dates.',
  };
}

export async function fetchApartmentReservations(propertySlug, checkIn, checkOut) {
  const result = await fetchPropertyAvailability(propertySlug, checkIn, checkOut);
  return result.blockedRanges;
}

export function buildAvailabilityResult(propertySlug, checkIn, checkOut, availabilityPayload) {
  const blockedRanges = normalizeBlockedRanges(availabilityPayload?.blockedRanges || []);
  const isAvailable = !blockedRanges.some((range) => dateRangeOverlaps(checkIn, checkOut, range.from, range.to));

  return buildAvailabilityResponse(propertySlug, isAvailable, blockedRanges, isAvailable ? 'Available for the selected dates.' : 'The selected dates overlap with an existing reservation.');
}
