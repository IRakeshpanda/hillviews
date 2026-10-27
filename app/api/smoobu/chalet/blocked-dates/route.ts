export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { buildSmoobuHeaders } from '../../../../../lib/smoobuHmac';

const SMOOBU_API_KEY = process.env.SMOOBU_API_KEY || '';
const SMOOBU_API_SECRET = process.env.SMOOBU_API_SECRET || '';
const CHALET_APARTMENT_ID = process.env.SMOOBU_CHALET_APARTMENT_ID || '';
const CHALET_ICAL = process.env.SMOOBU_CHALET_ICAL || '';

const toLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDay = (date: Date) => {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return next;
};

const parseIcalDate = (value: string): Date | null => {
  if (!value) return null;

  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{8})(T\d{6}Z?)?$/);
  if (!match) return null;

  const datePart = match[1];
  const year = Number(datePart.slice(0, 4));
  const month = Number(datePart.slice(4, 6));
  const day = Number(datePart.slice(6, 8));

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const expandBlockedDatesFromIcal = (icalText: string): string[] => {
  const blocked = new Set<string>();
  const lines = icalText.split(/\r?\n/);
  let currentEvent: { start: Date | null; end: Date | null } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) continue;
    if (trimmed === 'BEGIN:VEVENT') {
      currentEvent = { start: null, end: null };
      continue;
    }

    if (!currentEvent) continue;

    if (trimmed === 'END:VEVENT') {
      if (currentEvent.start && currentEvent.end && currentEvent.end > currentEvent.start) {
        for (let d = new Date(currentEvent.start); d < currentEvent.end; d = addDay(d)) {
          blocked.add(toLocalDateString(d));
        }
      }
      currentEvent = null;
      continue;
    }

    if (trimmed.startsWith('DTSTART')) {
      const value = trimmed.split(':').slice(1).join(':');
      currentEvent.start = parseIcalDate(value) ?? currentEvent.start;
      continue;
    }

    if (trimmed.startsWith('DTEND')) {
      const value = trimmed.split(':').slice(1).join(':');
      currentEvent.end = parseIcalDate(value) ?? currentEvent.end;
    }
  }

  return Array.from(blocked).sort();
};

export async function GET() {
  const blocked = new Set<string>();
  const from = new Date();
  from.setHours(0, 0, 0, 0);

  const to = new Date(from);
  to.setDate(to.getDate() + 540);

  const fromIso = toLocalDateString(from);
  const toIso = toLocalDateString(to);

  if (CHALET_ICAL) {
    try {
      const icalResponse = await fetch(CHALET_ICAL, {
        method: 'GET',
        cache: 'no-store',
      });

      if (icalResponse.ok) {
        const icalText = await icalResponse.text();
        const icalDates = expandBlockedDatesFromIcal(icalText);
        icalDates.forEach((date) => blocked.add(date));
      }
    } catch (error) {
      console.error('Smoobu iCal blocked dates fetch failed.', error);
    }
  }

  if (SMOOBU_API_KEY && SMOOBU_API_SECRET && CHALET_APARTMENT_ID) {
    try {
      const ratesUrl = new URL('https://login.smoobu.com/api/rates');
      ratesUrl.searchParams.set('apartments[]', CHALET_APARTMENT_ID);
      ratesUrl.searchParams.set('start_date', fromIso);
      ratesUrl.searchParams.set('end_date', toIso);

      const path = `${ratesUrl.pathname}${ratesUrl.search}`;
      const response = await fetch(ratesUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...buildSmoobuHeaders('GET', path, '', SMOOBU_API_KEY, SMOOBU_API_SECRET),
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        const apartmentData = data?.data?.[CHALET_APARTMENT_ID] ?? data?.[CHALET_APARTMENT_ID] ?? {};

        Object.entries(apartmentData)
          .filter(([, details]) => Number(details?.available) === 0 || details?.available === false)
          .forEach(([date]) => blocked.add(date));
      }
    } catch (error) {
      console.error('Smoobu rate blocked dates fetch failed.', error);
    }
  }

  return NextResponse.json({ blocked: Array.from(blocked).sort() });
}
