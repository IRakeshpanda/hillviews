/**
 * Booking utilities for Hill View luxury cottage.
 * Handles date formatting, sessionStorage persistence, URL query synchronization,
 * and constraint validations (past dates, min 1 night, max 6 guests).
 */

export const MAX_GUESTS = 6;
export const MIN_GUESTS = 1;
export const STORAGE_KEY = 'hillview_booking_search';

export function getTodayIso() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysIso(isoDateStr, days = 1) {
  if (!isoDateStr) return '';
  const [y, m, d] = isoDateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(isoDateStr, { includeDay = true, includeYear = true } = {}) {
  if (!isoDateStr) return '';
  const [y, m, d] = isoDateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return isoDateStr;

  const options = {
    month: 'short',
    day: 'numeric',
    ...(includeDay ? { weekday: 'short' } : {}),
    ...(includeYear ? { year: 'numeric' } : {}),
  };

  return date.toLocaleDateString('en-GB', options);
}

export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const [y1, m1, d1] = checkIn.split('-').map(Number);
  const [y2, m2, d2] = checkOut.split('-').map(Number);
  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);
  const diffMs = date2.getTime() - date1.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

export function saveBookingSearch({ checkIn, checkOut, guests }) {
  if (typeof window === 'undefined') return;
  const payload = {
    checkIn: checkIn || '',
    checkOut: checkOut || '',
    guests: Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, Number(guests) || 2)),
    updatedAt: Date.now(),
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('Unable to write to sessionStorage:', e);
  }
}

export function loadBookingSearch(searchParams = null) {
  let checkIn = '';
  let checkOut = '';
  let guests = null;
  let hasFoundValues = false;

  // 1. Read from URL search parameters first
  if (searchParams) {
    const pCheckIn = searchParams.get('checkin') || searchParams.get('checkIn');
    const pCheckOut = searchParams.get('checkout') || searchParams.get('checkOut');
    const pGuests = searchParams.get('guests');

    if (pCheckIn) {
      checkIn = pCheckIn.trim();
      hasFoundValues = true;
    }
    if (pCheckOut) {
      checkOut = pCheckOut.trim();
      hasFoundValues = true;
    }
    if (pGuests) {
      const parsed = parseInt(pGuests, 10);
      if (!Number.isNaN(parsed) && parsed >= MIN_GUESTS) {
        guests = Math.min(MAX_GUESTS, parsed);
        hasFoundValues = true;
      }
    }
  }

  // 2. Fall back to sessionStorage if URL parameters are incomplete
  if (typeof window !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!checkIn && parsed.checkIn) {
          checkIn = parsed.checkIn;
          hasFoundValues = true;
        }
        if (!checkOut && parsed.checkOut) {
          checkOut = parsed.checkOut;
          hasFoundValues = true;
        }
        if (guests === null && parsed.guests) {
          guests = Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, Number(parsed.guests) || 2));
          hasFoundValues = true;
        }
      }
    } catch (e) {
      console.warn('Unable to read from sessionStorage:', e);
    }
  }

  // 3. Normalize constraints
  if (checkIn && checkOut && checkOut <= checkIn) {
    checkOut = addDaysIso(checkIn, 1);
  }

  if (guests === null) {
    guests = 2; // Default guests
  } else {
    guests = Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, guests));
  }

  return {
    checkIn,
    checkOut,
    guests,
    hasFoundValues,
  };
}
