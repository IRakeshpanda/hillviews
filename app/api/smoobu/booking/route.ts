import { NextResponse } from 'next/server';
import { buildSmoobuHeaders } from '../../../../lib/smoobuHmac';

const SMOOBU_API_KEY = process.env.SMOOBU_API_KEY || '';
const SMOOBU_API_SECRET = process.env.SMOOBU_API_SECRET || '';
const HILL_VIEW_APARTMENT_ID = process.env.SMOOBU_HILL_VIEW_APARTMENT_ID || '';

function isDateRangeUnavailable(bookedDates: string[], startDate: string, endDate: string): boolean {
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
    return true;
  }

  const cursor = new Date(start);
  while (cursor < end) {
    const isoDate = cursor.toISOString().slice(0, 10);
    if (bookedDates.includes(isoDate)) {
      return true;
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return false;
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

    const start = new Date(`${arrivalDate}T00:00:00Z`);
    const end = new Date(`${departureDate}T00:00:00Z`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      return NextResponse.json({ error: 'Check-in must be before check-out.' }, { status: 400 });
    }

    const ratesUrl = new URL('https://login.smoobu.com/api/rates');
    ratesUrl.searchParams.set('apartments[]', HILL_VIEW_APARTMENT_ID);
    ratesUrl.searchParams.set('start_date', arrivalDate);
    ratesUrl.searchParams.set('end_date', departureDate);

    const availabilityResponse = await fetch(ratesUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...buildSmoobuHeaders('GET', `${ratesUrl.pathname}${ratesUrl.search}`, '', SMOOBU_API_KEY, SMOOBU_API_SECRET),
      },
    });

    if (!availabilityResponse.ok) {
      const detail = await availabilityResponse.text();
      console.error('Smoobu availability check failed before booking creation', { status: availabilityResponse.status, detail });
      return NextResponse.json({ error: 'We could not verify availability for the selected dates. Please try another date range.' }, { status: 502 });
    }

    const availabilityData = await availabilityResponse.json();
    const apartmentData = availabilityData?.data?.[HILL_VIEW_APARTMENT_ID] ?? availabilityData?.[HILL_VIEW_APARTMENT_ID] ?? {};
    const bookedDates = Object.entries(apartmentData)
      .filter(([, details]: [string, any]) => details?.available === 0 || details?.available === false)
      .map(([date]) => date);

    if (isDateRangeUnavailable(bookedDates, arrivalDate, departureDate)) {
      return NextResponse.json({ error: 'The selected stay overlaps with an unavailable date. Please choose another range.' }, { status: 409 });
    }

    const reservationBody = {
      arrivalDate,
      departureDate,
      apartmentId: HILL_VIEW_APARTMENT_ID,
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
    const signedHeaders = buildSmoobuHeaders(
      'POST',
      '/api/reservations',
      JSON.stringify(reservationBody),
      SMOOBU_API_KEY,
      SMOOBU_API_SECRET,
    );

    const reservationResponse = await fetch(reservationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...signedHeaders,
      },
      body: JSON.stringify(reservationBody),
    });

    const reservationData = await reservationResponse.text();
    let parsedReservationData;
    try {
      parsedReservationData = reservationData ? JSON.parse(reservationData) : {};
    } catch {
      parsedReservationData = {};
    }

    if (!reservationResponse.ok) {
      console.error('Smoobu booking creation failed', {
        status: reservationResponse.status,
        response: parsedReservationData,
      });
      return NextResponse.json(
        { error: parsedReservationData?.message || 'Your booking request could not be submitted. Please try again.' },
        { status: reservationResponse.status || 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your booking request has been received.',
      booking: parsedReservationData,
      reference: parsedReservationData?.id || parsedReservationData?.reservationId || parsedReservationData?.bookingId || null,
    });
  } catch (error) {
    console.error('Unexpected booking submission error:', error);
    return NextResponse.json({ error: 'Something went wrong while sending your booking request.' }, { status: 500 });
  }
}
