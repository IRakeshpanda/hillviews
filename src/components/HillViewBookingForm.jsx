import { useEffect, useMemo, useState } from 'react';

const PROPERTY_OPTIONS = [
  { value: 'chalet-le-joyau', label: 'Chalet Le Joyau' },
  { value: 'hill-view', label: 'Hill View' },
];

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

const dateRangeOverlaps = (requestStart, requestEnd, blockedStart, blockedEnd) => {
  if (!requestStart || !requestEnd || !blockedStart || !blockedEnd) return false;
  const start = parseLocalDate(requestStart);
  const end = parseLocalDate(requestEnd);
  const blockedFrom = parseLocalDate(blockedStart);
  const blockedTo = parseLocalDate(blockedEnd);

  if (!start || !end || !blockedFrom || !blockedTo) return false;

  return start < blockedTo && end > blockedFrom;
};

const buildBlockedRangesFromResponse = (payload) => {
  const rawRanges = payload?.blockedRanges || payload?.result?.blockedRanges || payload?.result?.bookedRanges || [];

  if (!Array.isArray(rawRanges)) {
    return [];
  }

  return rawRanges
    .filter((range) => range && typeof range === 'object' && range.from && range.to)
    .map((range) => ({
      from: String(range.from),
      to: String(range.to),
    }));
};

const readResponseJsonSafely = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return { message: text };
  }
};

export default function HillViewBookingForm({
  property = 'hill-view',
  propertyName = 'Hill View',
  nightRate = 185,
  cleaningFee = 45,
}) {
  const NIGHT_RATE = nightRate;
  const CLEANING_FEE = cleaningFee;
  const today = useMemo(() => formatDate(new Date()), []);

  const [selectedProperty, setSelectedProperty] = useState(property);
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [blockedRanges, setBlockedRanges] = useState([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('idle');
  const [fieldErrors, setFieldErrors] = useState({});

  const nights = calculateNights(arrivalDate, departureDate);
  const subtotal = nights * NIGHT_RATE;
  const total = subtotal + CLEANING_FEE;

  useEffect(() => {
    setSelectedProperty(property);
  }, [property]);

  useEffect(() => {
    if (!arrivalDate || !departureDate || arrivalDate >= departureDate) {
      setBlockedRanges([]);
      setFieldErrors((previous) => ({ ...previous, availability: '' }));
      return;
    }

    let isCurrent = true;
    setIsCheckingAvailability(true);
    setFieldErrors((previous) => ({ ...previous, availability: '' }));
    setStatusMessage('');
    setStatusType('idle');

    const fetchAvailability = async () => {
      try {
        const response = await fetch('/api/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertySlug: selectedProperty,
            checkIn: arrivalDate,
            checkOut: departureDate,
          }),
        });

        const data = await readResponseJsonSafely(response);

        if (!response.ok) {
          if (isCurrent) {
            setFieldErrors((previous) => ({
              ...previous,
              availability: data?.message || data?.error || `Unable to verify availability for ${propertyName}.`,
            }));
            setBlockedRanges([]);
          }
          return;
        }

        if (isCurrent) {
          const nextBlockedRanges = buildBlockedRangesFromResponse(data);
          const hasOverlap = nextBlockedRanges.some((range) => dateRangeOverlaps(arrivalDate, departureDate, range.from, range.to));
          setBlockedRanges(nextBlockedRanges);

          if (hasOverlap || data?.isAvailable === false) {
            setFieldErrors((previous) => ({
              ...previous,
              availability: data?.message || 'The selected dates overlap with an unavailable date range.',
            }));
          } else {
            setFieldErrors((previous) => ({ ...previous, availability: '' }));
          }
        }
      } catch (error) {
        if (isCurrent) {
          setFieldErrors((previous) => ({
            ...previous,
            availability: 'We could not verify availability right now. Please try again.',
          }));
          setBlockedRanges([]);
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
  }, [arrivalDate, departureDate, propertyName, selectedProperty]);

  const rangeIsUnavailable = blockedRanges.some((range) => dateRangeOverlaps(arrivalDate, departureDate, range.from, range.to)) || !!fieldErrors.availability;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!arrivalDate || !departureDate) {
      setFieldErrors((previous) => ({ ...previous, availability: 'Please choose valid arrival and departure dates.' }));
      setStatusType('error');
      setStatusMessage('Please choose valid arrival and departure dates.');
      return;
    }

    if (arrivalDate >= departureDate) {
      setFieldErrors((previous) => ({ ...previous, availability: 'Check-out must be after check-in.' }));
      setStatusType('error');
      setStatusMessage('Check-out must be after check-in.');
      return;
    }

    if (rangeIsUnavailable) {
      setFieldErrors((previous) => ({ ...previous, availability: 'The selected dates are not available.' }));
      setStatusType('error');
      setStatusMessage('The selected dates are not available. Please choose another range.');
      return;
    }

    setStatusType('success');
    setStatusMessage('Availability confirmed for the selected property and dates.');
  };

  const handlePropertyChange = (nextProperty) => {
    setSelectedProperty(nextProperty);
    setArrivalDate('');
    setDepartureDate('');
    setBlockedRanges([]);
    setFieldErrors((previous) => ({ ...previous, availability: '' }));
    setStatusMessage('');
    setStatusType('idle');
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
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
          <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Property</label>
          <select
            value={selectedProperty}
            onChange={(event) => handlePropertyChange(event.target.value)}
            className="w-full bg-transparent text-sm text-neutral-900 outline-none"
          >
            {PROPERTY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Check-in</label>
            <input
              type="date"
              min={today}
              value={arrivalDate}
              onChange={(event) => setArrivalDate(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Check-out</label>
            <input
              type="date"
              min={addDays(arrivalDate || today, 1)}
              value={departureDate}
              onChange={(event) => setDepartureDate(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
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

        {isCheckingAvailability && (
          <p className="text-[11px] text-neutral-500">Checking live availability…</p>
        )}

        {fieldErrors.availability && (
          <p className="text-[11px] font-medium text-rose-600">{fieldErrors.availability}</p>
        )}

        {statusMessage && (
          <div className={`rounded-2xl border px-3 py-2 text-[11px] ${statusType === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
            {statusMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isCheckingAvailability || !arrivalDate || !departureDate || arrivalDate >= departureDate || rangeIsUnavailable}
          className="w-full py-3.5 rounded-full bg-neutral-900 hover:bg-black text-white font-semibold text-sm transition-all shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCheckingAvailability ? 'Checking availability…' : 'Check availability'}
        </button>
      </form>
    </div>
  );
}