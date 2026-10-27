import { useEffect, useMemo, useState } from 'react';
import ChaletLeJoyauBookingCalendar from './ChaletLeJoyauBookingCalendar';

const NIGHT_RATE = 185;
const CLEANING_FEE = 45;

const toLocalDateString = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseLocalDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
};

const calculateNights = (arrivalDate, departureDate) => {
  if (!arrivalDate || !departureDate) return 0;
  const arrival = parseLocalDate(arrivalDate);
  const departure = parseLocalDate(departureDate);

  if (!arrival || !departure) return 0;

  const diffMs = departure.getTime() - arrival.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
};

const containsBlockedNight = (startDate, endDate, blockedDates) => {
  if (!startDate || !endDate) return false;

  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
    return false;
  }

  let cursor = new Date(start);
  while (cursor < end) {
    const iso = toLocalDateString(cursor);
    if (blockedDates.includes(iso)) {
      return true;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return false;
};

const readResponseJsonSafely = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn('Non-JSON response received from API.', text);
    return { message: text };
  }
};

export default function ChaletLeJoyauBookingForm() {
  const today = useMemo(() => new Date(), []);
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [blockedDates, setBlockedDates] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('idle');
  const [fieldErrors, setFieldErrors] = useState({});

  const loadBlockedDates = async () => {
    try {
      const response = await fetch('/api/smoobu/chalet/blocked-dates', { cache: 'no-store' });
      if (!response.ok) {
        console.warn('Unable to load booked dates for Chalet le Joyau.');
        return;
      }

      const data = await response.json();
      setBlockedDates(Array.isArray(data?.blocked) ? data.blocked : []);
    } catch (error) {
      console.warn('Could not refresh blocked dates.', error);
      setBlockedDates([]);
    }
  };

  useEffect(() => {
    loadBlockedDates();
  }, []);

  const nights = calculateNights(arrivalDate, departureDate);
  const subtotal = nights * NIGHT_RATE;
  const total = subtotal + CLEANING_FEE;
  const rangeContainsBookedNight = Boolean(range.from && range.to && containsBlockedNight(range.from, range.to, blockedDates));
  const isSubmitDisabled = isSubmitting || !arrivalDate || !departureDate || rangeContainsBookedNight;

  const validateForm = () => {
    const nextErrors = {};

    if (!arrivalDate) nextErrors.arrivalDate = 'Check-in date is required.';
    if (!departureDate) nextErrors.departureDate = 'Check-out date is required.';

    if (arrivalDate && departureDate) {
      const checkIn = parseLocalDate(arrivalDate);
      const checkOut = parseLocalDate(departureDate);
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (checkIn && checkIn < todayStart) {
        nextErrors.arrivalDate = 'Past dates are not available.';
      }

      if (checkIn && checkOut && checkOut <= checkIn) {
        nextErrors.departureDate = 'Check-out must be after check-in.';
      }
    }

    if (!firstName.trim()) nextErrors.firstName = 'First name is required.';
    if (!lastName.trim()) nextErrors.lastName = 'Last name is required.';
    if (!email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Please enter a valid email address.';
    if (!phone.trim()) nextErrors.phone = 'Phone number is required.';
    if (Number(adults) < 1) nextErrors.adults = 'Please choose at least one adult.';
    if (children < 0) nextErrors.children = 'Children cannot be negative.';
    if (rangeContainsBookedNight) nextErrors.availability = 'Those dates include a booked night — please pick another range.';

    setFieldErrors((previous) => ({ ...previous, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const handleCalendarSelect = (selectedRange) => {
    if (!selectedRange) {
      setRange({ from: undefined, to: undefined });
      setArrivalDate('');
      setDepartureDate('');
      setStatusType('idle');
      setStatusMessage('');
      return;
    }

    if (selectedRange.from && selectedRange.to) {
      const overlapsBookedNight = containsBlockedNight(selectedRange.from, selectedRange.to, blockedDates);
      if (overlapsBookedNight) {
        setRange({ from: selectedRange.from, to: undefined });
        setArrivalDate(toLocalDateString(selectedRange.from));
        setDepartureDate('');
        setStatusType('error');
        setStatusMessage('Those dates include a booked night — please pick another range.');
        setFieldErrors((previous) => ({ ...previous, availability: 'Those dates include a booked night — please pick another range.' }));
        return;
      }
    }

    setRange(selectedRange);
    setArrivalDate(selectedRange.from ? toLocalDateString(selectedRange.from) : '');
    setDepartureDate(selectedRange.to ? toLocalDateString(selectedRange.to) : '');
    setStatusType('idle');
    setStatusMessage('');
    setFieldErrors((previous) => ({ ...previous, arrivalDate: '', departureDate: '', availability: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setStatusType('error');
      setStatusMessage('Please review the highlighted booking details and try again.');
      return;
    }

    setIsSubmitting(true);
    setStatusType('idle');
    setStatusMessage('');

    try {
      const response = await fetch('/api/smoobu/chalet/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arrivalDate,
          departureDate,
          adults: Number(adults),
          children: Number(children || 0),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          notice: notes.trim(),
        }),
      });

      const data = await readResponseJsonSafely(response);

      if (response.status === 409) {
        setRange({ from: undefined, to: undefined });
        setArrivalDate('');
        setDepartureDate('');
        setStatusType('error');
        setStatusMessage(data?.error || 'Those dates were just taken. Please pick another range.');
        setFieldErrors((previous) => ({ ...previous, availability: data?.error || 'Those dates were just taken. Please pick another range.' }));
        await loadBlockedDates();
        return;
      }

      if (!response.ok) {
        throw new Error(data?.error || 'We could not complete your booking request. Please try again.');
      }

      setStatusType('success');
      setStatusMessage(
        data?.reference || data?.bookingId
          ? `Booking confirmed. Reference: ${data.reference || data.bookingId}`
          : 'Booking confirmed. We will be in touch shortly.'
      );

      setRange({ from: undefined, to: undefined });
      setArrivalDate('');
      setDepartureDate('');
      await loadBlockedDates();
    } catch (error) {
      console.error('Booking request failed:', error);
      setStatusType('error');
      setStatusMessage(error.message || 'We could not complete your booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-[0_18px_50px_rgba(17,17,17,0.08)]">
      <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-neutral-100">
        <div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 font-bold">Direct booking</span>
          <p className="mt-2 text-3xl font-bold text-neutral-900">
            £{NIGHT_RATE} <span className="text-sm font-normal text-neutral-500">/ night</span>
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Calendar
          </span>
          <p className="text-[10px] text-neutral-400 mt-1">Zero booking fees</p>
        </div>
      </div>

      <ChaletLeJoyauBookingCalendar range={range} onSelect={handleCalendarSelect} blockedDates={blockedDates} />

      {fieldErrors.availability && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {fieldErrors.availability}
        </div>
      )}

      {statusMessage && (
        <div
          className={`mb-4 rounded-2xl border px-3 py-2 text-xs ${
            statusType === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {statusMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Check-in</label>
            <input
              type="text"
              value={arrivalDate}
              readOnly
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none"
              placeholder="Select date"
            />
            {fieldErrors.arrivalDate && <p className="mt-1 text-[10px] text-rose-600">{fieldErrors.arrivalDate}</p>}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Check-out</label>
            <input
              type="text"
              value={departureDate}
              readOnly
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none"
              placeholder="Select date"
            />
            {fieldErrors.departureDate && <p className="mt-1 text-[10px] text-rose-600">{fieldErrors.departureDate}</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
          <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Adults</label>
          <select
            value={adults}
            onChange={(event) => {
              setAdults(Number(event.target.value));
              setFieldErrors((previous) => ({ ...previous, adults: '' }));
            }}
            className="w-full bg-transparent text-sm text-neutral-900 outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((value) => (
              <option key={value} value={value}>{value} adult{value > 1 ? 's' : ''}</option>
            ))}
          </select>
          {fieldErrors.adults && <p className="mt-1 text-[10px] text-rose-600">{fieldErrors.adults}</p>}
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
          <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Children</label>
          <select
            value={children}
            onChange={(event) => {
              setChildren(Number(event.target.value));
              setFieldErrors((previous) => ({ ...previous, children: '' }));
            }}
            className="w-full bg-transparent text-sm text-neutral-900 outline-none"
          >
            {[0, 1, 2, 3, 4].map((value) => (
              <option key={value} value={value}>{value} child{value === 1 ? '' : 'ren'}</option>
            ))}
          </select>
          {fieldErrors.children && <p className="mt-1 text-[10px] text-rose-600">{fieldErrors.children}</p>}
        </div>

        <div className="space-y-3 pt-2 border-t border-neutral-100">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">First name</label>
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
            {fieldErrors.firstName && <p className="mt-1 text-[10px] text-rose-600">{fieldErrors.firstName}</p>}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
            {fieldErrors.lastName && <p className="mt-1 text-[10px] text-rose-600">{fieldErrors.lastName}</p>}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
            {fieldErrors.email && <p className="mt-1 text-[10px] text-rose-600">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
            {fieldErrors.phone && <p className="mt-1 text-[10px] text-rose-600">{fieldErrors.phone}</p>}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows="3"
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 resize-none"
              placeholder="Optional message for the host"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 px-3 py-4">
          <div className="flex items-center justify-between text-sm text-neutral-600">
            <span>Stay</span>
            <span>{nights || 0} night{nights === 1 ? '' : 's'}</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-neutral-600">
            <span>Rate</span>
            <span>£{NIGHT_RATE.toLocaleString()} / night</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-sm text-neutral-600">
            <span>Cleaning fee</span>
            <span>£{CLEANING_FEE}</span>
          </div>
          <div className="border-t border-neutral-200 pt-3 mt-3 flex items-center justify-between font-bold text-neutral-900">
            <span>Total</span>
            <span>£{total.toLocaleString()}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full rounded-full bg-neutral-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {isSubmitting ? 'Processing…' : 'Check availability'}
        </button>
      </form>
    </div>
  );
}
