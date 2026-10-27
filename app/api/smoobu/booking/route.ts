export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { buildSmoobuHeaders } from '../../../../lib/smoobuHmac';

const SMOOBU_API_KEY = process.env.SMOOBU_API_KEY || '';
const SMOOBU_API_SECRET = process.env.SMOOBU_API_SECRET || '';
const HILL_VIEW_APARTMENT_ID = process.env.SMOOBU_HILL_VIEW_APARTMENT_ID || '';

function parseLocalDate(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateRangeContainsBookedNight(startDate: string, endDate: string, bookedDates: string[]): boolean {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  if (!start || !end || start >= end) {
    return false;
  }

  let cursor = new Date(start);
  while (cursor < end) {
    if (bookedDates.includes(toLocalDateString(cursor))) {
      return true;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return false;
}

function apartmentIsAvailable(responseBody: any): boolean {
  const availableApartments = Array.isArray(responseBody?.availableApartments)
    ? responseBody.availableApartments.map((value: string | number) => String(value))
    : [];

  if (availableApartments.length > 0) {
    return availableApartments.includes(String(HILL_VIEW_APARTMENT_ID));
  }

  const apartmentEntry = responseBody?.data?.[String(HILL_VIEW_APARTMENT_ID)] ?? responseBody?.[String(HILL_VIEW_APARTMENT_ID)];
  if (apartmentEntry && typeof apartmentEntry === 'object') {
    const value = apartmentEntry.available;
    if (value === false || value === 0 || value === '0') return false;
    if (value === true || value === 1 || value === '1') return true;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
    } = body || {};

    const requiredFields = {
      arrivalDate,
      departureDate,
      firstName,
      lastName,
      email,
      phone,
      adults,
    };

    const missingField = Object.entries(requiredFields).find(([_, value]) => {
      if (typeof value === 'string') return value.trim() === '';
      return value === undefined || value === null || value === '';
    });

    if (missingField) {
      return NextResponse.json({ error: 'Please complete all required booking details.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (Number(adults) < 1) {
      return NextResponse.json({ error: 'At least one adult is required.' }, { status: 400 });
    }

    if (!SMOOBU_API_KEY || !SMOOBU_API_SECRET || !HILL_VIEW_APARTMENT_ID) {
      return NextResponse.json({ error: 'Smoobu booking is not configured on this server.' }, { status: 500 });
    }

    const start = parseLocalDate(arrivalDate);
    const end = parseLocalDate(departureDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!start || !end || end <= start) {
      return NextResponse.json({ error: 'Check-out must be after check-in.' }, { status: 400 });
    }

    if (start < today) {
      return NextResponse.json({ error: 'Past dates are not available.' }, { status: 400 });
    }

    const availabilityPayload = {
      arrivalDate,
      departureDate,
      apartments: [Number(HILL_VIEW_APARTMENT_ID)],
    };
    const availabilityBody = JSON.stringify(availabilityPayload);
    const availabilityResponse = await fetch('https://login.smoobu.com/booking/checkApartmentAvailability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...buildSmoobuHeaders('POST', '/booking/checkApartmentAvailability', availabilityBody, SMOOBU_API_KEY, SMOOBU_API_SECRET),
      },
      body: availabilityBody,
    });

    const availabilityText = await availabilityResponse.text();
    let availabilityData: any = {};
    try {
      availabilityData = availabilityText ? JSON.parse(availabilityText) : {};
    } catch {
      availabilityData = { raw: availabilityText };
    }

    if (availabilityResponse.status >= 400 || !apartmentIsAvailable(availabilityData)) {
      console.error('Smoobu apartment availability check failed', {
        status: availabilityResponse.status,
        response: availabilityData,
      });

      if (!apartmentIsAvailable(availabilityData)) {
        return NextResponse.json({ error: 'Those dates were just taken. Please pick another range.' }, { status: 409 });
      }

      return NextResponse.json({ error: 'We could not verify availability for the selected dates. Please try another date range.' }, { status: 502 });
    }

    const reservationBody = {
      arrivalDate,
      departureDate,
      apartmentId: Number(HILL_VIEW_APARTMENT_ID),
      channelId: 70,
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      adults: Number(adults),
      children: Number(children || 0),
      notice: String(notice || '').trim(),
    };

    const reservationUrl = 'https://login.smoobu.com/api/reservations';
    const reservationPayload = JSON.stringify(reservationBody);

    const reservationResponse = await fetch(reservationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...buildSmoobuHeaders('POST', '/api/reservations', reservationPayload, SMOOBU_API_KEY, SMOOBU_API_SECRET),
      },
      body: reservationPayload,
    });

    const reservationText = await reservationResponse.text();
    let parsedReservationData: any = {};
    try {
      parsedReservationData = reservationText ? JSON.parse(reservationText) : {};
    } catch {
      parsedReservationData = { raw: reservationText };
    }

    if (!reservationResponse.ok) {
      console.error('Smoobu booking creation failed', {
        status: reservationResponse.status,
        response: parsedReservationData,
      });
      return NextResponse.json(
        { error: parsedReservationData?.message || 'Your booking request could not be submitted. Please try again.' },
        { status: 500 },
      );
    }

    const bookingId = parsedReservationData?.id || parsedReservationData?.reservationId || parsedReservationData?.bookingId || null;
    return NextResponse.json({
      success: true,
      message: 'Your booking request has been received.',
      bookingId,
      reference: bookingId,
      booking: parsedReservationData,
    });
  } catch (error) {
    console.error('Unexpected booking submission error:', error);
    return NextResponse.json({ error: 'Something went wrong while sending your booking request.' }, { status: 500 });
  }
}

