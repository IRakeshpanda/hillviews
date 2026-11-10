import { useEffect, useMemo, useState } from 'react';

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
    return payload?.error || payload?.message || 'The booking endpoint was not found.';
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
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());
  const [calendarDays, setCalendarDays] = useState({});
  const [availabilityError, setAvailabilityError] = useState('');
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('idle');
  const [fieldErrors, setFieldErrors] = useState({});

  const nights = calculateNights(arrivalDate, departureDate);
  const subtotal = nights * NIGHT_RATE;
  const total = subtotal + CLEANING_FEE;

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(calendarMonth);
  }, [calendarMonth]);

  useEffect(() => {
    let active = true;
    setAvailabilityError('');
    setIsCheckingAvailability(true);

    const startOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const endOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 2, 0);
    const from = formatDate(startOfMonth);
    const to = formatDate(endOfMonth);

    const fetchCalendarData = async () => {
      try {
        const response = await fetch(`/api/availability?from=${from}&to=${to}`);
        if (!response.ok) {
          throw new Error('Availability unavailable');
        }

        const payload = await response.json();
        if (!payload || typeof payload.days !== 'object' || Array.isArray(payload.days)) {
          throw new Error('Availability unavailable');
        }

        if (active) {
          setCalendarDays(payload.days);
          setAvailabilityError('');
        }
      } catch (error) {
        if (active) {
          setCalendarDays({});
          setAvailabilityError("Couldn't load availability. Try again");
        }
      } finally {
        if (active) {
          setIsCheckingAvailability(false);
        }
      }
    };

    fetchCalendarData();
    return () => {
      active = false;
    };
  }, [calendarMonth]);

  useEffect(() => {
    if (!arrivalDate || !departureDate || arrivalDate >= departureDate) {
      setBookedDates([]);
      setFieldErrors((previous) => ({ ...previous, availability: '' }));
      return;
    }

    let isCurrent = true;
    setIsCheckingAvailability(true);
    setFieldErrors((previous) => ({ ...previous, availability: '' }));

    const fetchAvailability = async () => {
      try {
        const response = await fetch('/api/smoobu/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            arrivalDate,
            departureDate,
            guests: Number(adults || 2),
          }),
        });

        const data = await readResponseJsonSafely(response);

        if (!response.ok) {
          if (isCurrent) {
            setFieldErrors((previous) => ({
              ...previous,
              availability: data?.message || 'Unable to verify availability right now. Please try again.',
            }));
          }
          return;
        }

        if (isCurrent) {
          if (data?.available === false) {
            setFieldErrors((previous) => ({
              ...previous,
              availability: data?.message || 'The selected dates are not available.',
            }));
            setBookedDates([]);
          } else {
            setFieldErrors((previous) => ({ ...previous, availability: '' }));
            setBookedDates([]);
          }
        }
      } catch (error) {
        console.warn('Unable to sync availability.', error);
        if (isCurrent) {
          setFieldErrors((previous) => ({
            ...previous,
            availability: 'We could not verify availability right now. Please try again.',
          }));
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
  }, [arrivalDate, departureDate, adults]);

  const rangeIsUnavailable = hasAvailabilityOverlap(arrivalDate, departureDate, bookedDates) || !!fieldErrors.availability;

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

    setFieldErrors((previous) => ({ ...previous, ...nextErrors }));
    return Object.keys(nextErrors).length === 0 && !fieldErrors.availability;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      setStatusType('error');
      setStatusMessage(fieldErrors.availability || 'The selected dates are unavailable. Please choose another range.');
      return;
    }

    if (fieldErrors.availability || rangeIsUnavailable) {
      setStatusType('error');
      setStatusMessage(fieldErrors.availability || 'The selected dates are unavailable. Please choose another range.');
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

  const getCalendarCellState = (dateKey) => {
    const todayKey = formatDate(new Date());
    if (dateKey < todayKey) {
      return 'past';
    }

    const info = calendarDays[dateKey];
    if (!info || typeof info !== 'object') {
      return 'nodata';
    }

    if (info.available === false) {
      return 'booked';
    }

    return 'available';
  };

  const selectDate = (dateKey) => {
    if (dateKey < formatDate(new Date())) return;

    const dayInfo = calendarDays[dateKey];
    if (!dayInfo || typeof dayInfo !== 'object' || dayInfo.available === false) return;

    if (!arrivalDate || arrivalDate === departureDate || (arrivalDate && departureDate && arrivalDate < departureDate)) {
      if (!arrivalDate || dateKey < arrivalDate) {
        setArrivalDate(dateKey);
        setDepartureDate('');
        return;
      }

      if (dateKey > arrivalDate) {
        setDepartureDate(dateKey);
      }
      return;
    }

    if (!departureDate && dateKey > arrivalDate) {
      setDepartureDate(dateKey);
    }
  };

  const monthDates = useMemo(() => {
    const first = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const startOffset = first.getDay();
    const totalCells = 42;
    const cells = [];

    for (let index = 0; index < totalCells; index += 1) {
      const date = new Date(first);
      date.setDate(first.getDate() + index - startOffset);
      const key = formatDate(date);
      cells.push({ key, date, inMonth: date.getMonth() === calendarMonth.getMonth() });
    }

    return cells;
  }, [calendarMonth]);

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
        <div className="mb-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold">Availability</p>
            <div className="flex items-center gap-2 text-[10px] text-neutral-500">
              <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="h-8 w-8 rounded-full border border-neutral-200 bg-white text-neutral-700">‹</button>
              <span className="min-w-[120px] text-center font-medium text-neutral-700">{monthLabel}</span>
              <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="h-8 w-8 rounded-full border border-neutral-200 bg-white text-neutral-700">›</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-2">
            {weekdayLabels.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthDates.map(({ key, date, inMonth }) => {
              const state = getCalendarCellState(key);
              const isSelected = key === arrivalDate || key === departureDate;
              const isInRange = arrivalDate && departureDate && key > arrivalDate && key < departureDate;
              const info = calendarDays[key];

              return (
                <button
                  key={key}
                  type="button"
                  aria-label={`${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)}, ${state}`}
                  onClick={() => selectDate(key)}
                  disabled={state === 'past' || state === 'nodata' || !inMonth}
                  className={[
                    'relative h-11 rounded-xl text-xs font-medium border transition-colors',
                    !inMonth ? 'opacity-30' : '',
                    state === 'past' ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed border-neutral-200' : '',
                    state === 'nodata' ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-200' : '',
                    state === 'booked' ? 'bg-red-500 text-white border-red-500 cursor-not-allowed' : '',
                    state === 'available' ? 'bg-white text-neutral-900 border-neutral-200 hover:border-neutral-900' : '',
                    isSelected ? 'ring-2 ring-neutral-900 ring-inset' : '',
                    isInRange ? 'bg-neutral-100 border-neutral-300' : '',
                  ].join(' ')}
                >
                  <span className="relative z-10">{date.getDate()}</span>
                  {state === 'available' && info?.price != null && (
                    <span className="absolute bottom-1 left-1 right-1 text-[8px] text-neutral-500">£{Number(info.price).toFixed(0)}</span>
                  )}
                </button>
              );
            })}
          </div>

          {availabilityError && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
              {availabilityError} <button type="button" onClick={() => setCalendarMonth(new Date())} className="ml-1 underline font-semibold">Retry</button>
            </div>
          )}

          <div className="mt-3 flex items-center gap-3 text-[10px] text-neutral-500">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-white border border-neutral-300" />Available</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />Booked</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />Unavailable</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Check-in</label>
            <input
              type="date"
              min={today}
              readOnly
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
              readOnly
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
