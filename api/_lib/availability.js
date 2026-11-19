import { PROPERTY_SLUGS, normalizePropertySlug, resolvePropertyConfig } from './properties.js';

export { resolvePropertyConfig };

export function isValidIsoDate(value) {
  if (typeof value !== 'string') {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function parseIsoDate(value) {
  if (!isValidIsoDate(value)) {
    return null;
  }

  return new Date(`${value}T00:00:00Z`);
}

export function validateAvailabilityRequest(propertySlug, checkIn, checkOut) {
  const slug = normalizePropertySlug(propertySlug);

  if (!slug || !PROPERTY_SLUGS.includes(slug)) {
    throw new Error(`Invalid propertySlug. Allowed values: ${PROPERTY_SLUGS.join(', ')}.`);
  }

  if (!isValidIsoDate(checkIn)) {
    throw new Error('checkIn must be a valid ISO date string in YYYY-MM-DD format.');
  }

  if (!isValidIsoDate(checkOut)) {
    throw new Error('checkOut must be a valid ISO date string in YYYY-MM-DD format.');
  }

  if (parseIsoDate(checkIn) >= parseIsoDate(checkOut)) {
    throw new Error('checkIn must be before checkOut.');
  }

  return {
    propertySlug: slug,
    checkIn,
    checkOut,
  };
}

export function dateRangeOverlaps(requestStart, requestEnd, blockedStart, blockedEnd) {
  const start = parseIsoDate(requestStart);
  const end = parseIsoDate(requestEnd);
  const rangeStart = parseIsoDate(blockedStart);
  const rangeEnd = parseIsoDate(blockedEnd);

  if (!start || !end || !rangeStart || !rangeEnd) {
    return false;
  }

  return start < rangeEnd && end > rangeStart;
}

export function normalizeBlockedRanges(blockedRanges) {
  if (!Array.isArray(blockedRanges)) {
    return [];
  }

  return blockedRanges
    .filter((range) => range && typeof range === 'object' && range.from && range.to)
    .map((range) => ({
      from: String(range.from),
      to: String(range.to),
    }));
}

export function buildAvailabilityResponse(propertySlug, isAvailable, blockedRanges, message) {
  return {
    propertySlug: propertySlug || null,
    isAvailable: Boolean(isAvailable),
    blockedRanges: normalizeBlockedRanges(blockedRanges),
    message: message || (Boolean(isAvailable) ? 'Available for the selected dates.' : 'The selected dates are unavailable.'),
  };
}
