import { useEffect, useMemo, useState } from 'react';

const NIGHT_RATE = 185;
const CLEANING_FEE = 45;

const formatDate = (date) => {
  const normalized = new Date(date);
  normalized.setMinutes(normalized.getMinutes() - normalized.getTimezoneOffset());
  return normalized.toISOString().slice(0, 10);
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

const addDays = (value, days) => {
  const date = parseLocalDate(value);
  if (!date) return value;
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

const hasAvailabilityOverlap = (startDate, endDate, bookedDates) => {
  if (!startDate || !endDate) return false;
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);

  if (!start || !end || start >= end) return false;

  let cursor = new Date(start);
  while (cursor < end) {
    const iso = formatDate(cursor);
    if (bookedDates.includes(iso)) {
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

const getRequestFailureMessage = (response, payload) => {
  if (response?.status === 404) {
    return 'The booking endpoint is not available in this local preview. Please run the app in the configured server environment that serves /api/smoobu/booking.';
  }

  return payload?.error || payload?.message || 'Booking request failed.';
};

export default function HillViewBookingForm() {
  const today = useMemo(() => formatDate(new Date()), []);

  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [bookedDates, setBookedDates] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('idle');
  const [fieldErrors, setFieldErrors] = useState({});

  const nights = calculateNights(arrivalDate, departureDate);
  const subtotal = nights * NIGHT_RATE;
  const total = subtotal + CLEANING_FEE;

  useEffect(() => {
    if (!arrivalDate || !departureDate || arrivalDate >= departureDate) {
      setBookedDates([]);
      return;
    }

    let isCurrent = true;
    setIsCheckingAvailability(true);

    const fetchAvailability = async () => {
      try {
        const params = new URLSearchParams({
          startDate: arrivalDate,
          endDate: departureDate,
        });

        const response = await fetch(`/api/smoobu/availability?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Availability unavailable');
        }

        const data = await readResponseJsonSafely(response);
        if (isCurrent && Array.isArray(data.bookedDates)) {
          setBookedDates(data.bookedDates);
        }
      } catch (error) {
        console.warn('Unable to sync availability.', error);
        if (isCurrent) {
          setBookedDates([]);
        }
      } finally {
        if (isCurrent) {
          setIsCheckingAvailability(false);
        }
      }
    };

    fetchAvailability();

    return () => {
      isCurrent = false;
    };
  }, [arrivalDate, departureDate]);

  const rangeIsUnavailable = hasAvailabilityOverlap(arrivalDate, departureDate, bookedDates);

  const validateForm = () => {
    const nextErrors = {};

    if (!arrivalDate) nextErrors.arrivalDate = 'Check-in date is required.';
    if (!departureDate) nextErrors.departureDate = 'Check-out date is required.';
    if (arrivalDate && departureDate && arrivalDate >= departureDate) {
      nextErrors.departureDate = 'Check-out must be after check-in.';
    }
    if (!firstName.trim()) nextErrors.firstName = 'First name is required.';
    if (!lastName.trim()) nextErrors.lastName = 'Last name is required.';
    if (!email.trim()) nextErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Please enter a valid email address.';
    if (!phone.trim()) nextErrors.phone = 'Phone number is required.';
    if (Number(adults) < 1) nextErrors.adults = 'Please choose at least one adult.';
    if (children < 0) nextErrors.children = 'Children cannot be negative.';

    if (arrivalDate && departureDate && rangeIsUnavailable) {
      nextErrors.availability = 'The selected dates overlap with a booked period. Please choose another range.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setStatusType('idle');
    setStatusMessage('');

    try {
      const response = await fetch('/api/smoobu/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

      if (!response.ok) {
        throw new Error(getRequestFailureMessage(response, data));
      }

      setStatusType('success');
      setStatusMessage(
        data?.reference
          ? `Booking request submitted successfully. Reference: ${data.reference}`
          : 'Booking request submitted successfully. We will be in touch shortly.'
      );

      setArrivalDate('');
      setDepartureDate('');
      setAdults(2);
      setChildren(0);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setNotes('');
      setFieldErrors({});
    } catch (error) {
      console.error('Booking request failed:', error);
      setStatusType('error');
      setStatusMessage(error.message || 'We could not complete your booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArrivalChange = (value) => {
    setArrivalDate(value);
    if (departureDate && value >= departureDate) {
      setDepartureDate('');
    }
    if (fieldErrors.arrivalDate || fieldErrors.departureDate || fieldErrors.availability) {
      setFieldErrors((previous) => ({ ...previous, arrivalDate: '', departureDate: '', availability: '' }));
    }
  };

  const handleDepartureChange = (value) => {
    setDepartureDate(value);
    if (fieldErrors.departureDate || fieldErrors.availability) {
      setFieldErrors((previous) => ({ ...previous, departureDate: '', availability: '' }));
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

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Check-in</label>
            <input
              type="date"
              min={today}
              value={arrivalDate}
              onChange={(event) => handleArrivalChange(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
            {fieldErrors.arrivalDate && <p className="mt-1 text-[10px] text-rose-600">{fieldErrors.arrivalDate}</p>}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Check-out</label>
            <input
              type="date"
              min={addDays(arrivalDate || today, 1)}
              value={departureDate}
              onChange={(event) => handleDepartureChange(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
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
              onChange={(event) => {
                setFirstName(event.target.value);
                setFieldErrors((previous) => ({ ...previous, firstName: '' }));
              }}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
            {fieldErrors.firstName && <p className="mt-1 text-[10px] text-rose-600">{fieldErrors.firstName}</p>}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
                setFieldErrors((previous) => ({ ...previous, lastName: '' }));
              }}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
            {fieldErrors.lastName && <p className="mt-1 text-[10px] text-rose-600">{fieldErrors.lastName}</p>}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setFieldErrors((previous) => ({ ...previous, email: '' }));
              }}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
            {fieldErrors.email && <p className="mt-1 text-[10px] text-rose-600">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                setFieldErrors((previous) => ({ ...previous, phone: '' }));
              }}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
            {fieldErrors.phone && <p className="mt-1 text-[10px] text-rose-600">{fieldErrors.phone}</p>}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              placeholder="Optional message for the host"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-4 space-y-2 text-xs text-neutral-600">
          <div className="flex items-center justify-between">
            <span>{nights || 0} nights</span>
            <span>£{subtotal || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Cleaning fee</span>
            <span>£{CLEANING_FEE}</span>
          </div>
          <div className="flex items-center justify-between font-semibold text-neutral-900 border-t border-neutral-200 pt-2">
            <span>Total</span>
            <span className="text-base">£{total || CLEANING_FEE}</span>
          </div>
        </div>

        {fieldErrors.availability && (
          <p className="text-[11px] font-medium text-rose-600">{fieldErrors.availability}</p>
        )}

        {isCheckingAvailability && (
          <p className="text-[11px] text-neutral-500">Checking live availability…</p>
        )}

        {statusMessage && (
          <div className={`rounded-2xl border px-3 py-2 text-[11px] ${statusType === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
            {statusMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isCheckingAvailability || rangeIsUnavailable}
          className="w-full py-3.5 rounded-full bg-neutral-900 hover:bg-black text-white font-semibold text-sm transition-all shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Requesting booking…' : 'Request Booking'}
        </button>
      </form>
    </div>
  );
}
