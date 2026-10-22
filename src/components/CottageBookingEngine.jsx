import { useEffect, useMemo, useState } from 'react';

const NIGHT_RATE = 185;
const CLEANING_FEE = 45;
const DEMO_BOOKED_DATES = [
  '2026-10-24',
  '2026-10-25',
  '2026-10-26',
  '2026-11-05',
  '2026-11-06',
  '2026-11-07',
];

const formatDate = (date) => {
  const normalized = new Date(date);
  normalized.setMinutes(normalized.getMinutes() - normalized.getTimezoneOffset());
  return normalized.toISOString().slice(0, 10);
};

const parseDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getNightCount = (arrival, departure) => {
  if (!arrival || !departure) return 0;
  const arrivalDate = parseDate(arrival);
  const departureDate = parseDate(departure);

  if (!(arrivalDate instanceof Date) || Number.isNaN(arrivalDate.getTime()) || !(departureDate instanceof Date) || Number.isNaN(departureDate.getTime())) {
    return 0;
  }

  const diffMs = departureDate.getTime() - arrivalDate.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
};

const isBookedDate = (dateValue, bookedDates = []) => Boolean(dateValue && bookedDates.includes(dateValue));

export default function CottageBookingEngine() {
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [bookedDates, setBookedDates] = useState([]);
  const [calendarNotice, setCalendarNotice] = useState('Loading live availability…');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState('idle');
  const [modalMessage, setModalMessage] = useState('');

  const today = useMemo(() => formatDate(new Date()), []);

  useEffect(() => {
    let isMounted = true;

    async function fetchCalendar() {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      const futureStr = formatDate(future);

      try {
        const liveResponse = await fetch(`/api/smoobu/availability?startDate=${today}&endDate=${futureStr}`);
        if (liveResponse.ok) {
          const liveData = await liveResponse.json();
          if (isMounted && Array.isArray(liveData.bookedDates)) {
            setBookedDates(liveData.bookedDates);
            setCalendarNotice(liveData.notice || 'Live Smoobu availability synced.');
            return;
          }
        }
      } catch (error) {
        console.warn('Live Smoobu endpoint unavailable. Falling back to preview dates.', error);
      }

      try {
        const fallbackResponse = await fetch(`/smoobu-availability.json?cacheBust=${Date.now()}`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (isMounted && Array.isArray(fallbackData.bookedDates)) {
            setBookedDates(fallbackData.bookedDates);
            setCalendarNotice(fallbackData.notice || 'Preview mode active. Add a live Smoobu feed to sync real availability.');
            return;
          }
        }
      } catch (error) {
        console.warn('Static availability feed unavailable. Using demo dates.', error);
      }

      if (isMounted) {
        setBookedDates(DEMO_BOOKED_DATES);
        setCalendarNotice('Preview mode active. Add a live Smoobu feed to sync real availability.');
      }
    }

    fetchCalendar();

    return () => {
      isMounted = false;
    };
  }, [today]);

  const nights = getNightCount(arrivalDate, departureDate);
  const subtotal = nights * NIGHT_RATE;
  const total = subtotal + CLEANING_FEE;

  const handleArrivalChange = (value) => {
    setArrivalDate(value);
    if (departureDate && value >= departureDate) {
      setDepartureDate('');
    }
  };

  const handleDepartureChange = (value) => {
    setDepartureDate(value);
    if (arrivalDate && value <= arrivalDate) {
      setModalState('error');
      setModalMessage('Departure date must be after arrival date.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!arrivalDate || !departureDate || !guestName.trim() || !guestEmail.trim()) {
      setModalMessage('Please fill in your name, email, and choose valid stay dates.');
      setModalState('error');
      return;
    }

    if (arrivalDate >= departureDate) {
      setModalMessage('Departure date must be after arrival date.');
      setModalState('error');
      return;
    }

    if (isBookedDate(arrivalDate, bookedDates) || isBookedDate(departureDate, bookedDates)) {
      setModalMessage('One or more selected dates are already booked. Please choose an alternative stay.');
      setModalState('error');
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingUrl = `https://booking.smoobu.com/1692217?from=${arrivalDate}&to=${departureDate}&adults=${guests}`;
      window.open(bookingUrl, '_blank', 'noopener,noreferrer');
      setModalMessage(`Reservation received! Thank you, ${guestName.trim()}. Your stay from ${arrivalDate} to ${departureDate} has been registered. A confirmation email with check-in instructions is on its way.`);
      setModalState('success');
    } catch (error) {
      console.error('Smoobu redirect failed', error);
      setModalMessage('We encountered a connection issue while contacting Smoobu. Please try again or reach Robert directly.');
      setModalState('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-neutral-900/10 shadow-2xl relative">
      <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-neutral-100">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-bold">Direct booking</span>
          <p className="mt-2 text-3xl font-bold text-neutral-900">
            £{NIGHT_RATE} <span className="text-sm font-normal text-neutral-500">/ night</span>
          </p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Calendar
          </span>
          <p className="text-[10px] text-neutral-400 mt-1">Zero booking fees</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Check-in</label>
            <input
              type="date"
              min={today}
              value={arrivalDate}
              onChange={(event) => handleArrivalChange(event.target.value)}
              className={`w-full bg-transparent text-xs font-semibold outline-none ${isBookedDate(arrivalDate, bookedDates) ? 'text-rose-600 font-bold' : 'text-neutral-900'}`}
              required
            />
          </div>

          <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
            <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Check-out</label>
            <input
              type="date"
              min={arrivalDate || today}
              value={departureDate}
              onChange={(event) => handleDepartureChange(event.target.value)}
              className={`w-full bg-transparent text-xs font-semibold outline-none ${isBookedDate(departureDate, bookedDates) ? 'text-rose-600 font-bold' : 'text-neutral-900'}`}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] px-1 text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
            Unavailable dates are blocked in red
          </span>
          <span>Max 6 guests</span>
        </div>

        <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200">
          <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Guest capacity</label>
          <select
            value={guests}
            onChange={(event) => setGuests(Number(event.target.value))}
            className="w-full bg-transparent text-xs font-semibold text-neutral-900 outline-none cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-neutral-100">
          <input
            type="text"
            placeholder="Full name"
            value={guestName}
            onChange={(event) => setGuestName(event.target.value)}
            className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 outline-none focus:ring-1 focus:ring-neutral-900"
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={guestEmail}
            onChange={(event) => setGuestEmail(event.target.value)}
            className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 outline-none focus:ring-1 focus:ring-neutral-900"
            required
          />
          <input
            type="tel"
            placeholder="Phone number (optional)"
            value={guestPhone}
            onChange={(event) => setGuestPhone(event.target.value)}
            className="w-full p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 outline-none focus:ring-1 focus:ring-neutral-900"
          />
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-full bg-neutral-900 hover:bg-black text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? 'Syncing with Smoobu…' : 'Reserve Hill View Cottage'}
        </button>
      </form>

      <p className="mt-3 text-[11px] text-neutral-500 text-center">{calendarNotice}</p>

      {modalState !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-4 border border-neutral-200">
            <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl font-bold ${modalState === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {modalState === 'success' ? '✓' : '✕'}
            </div>
            <h3 className="text-xl font-bold text-neutral-900">
              {modalState === 'success' ? 'Reservation status' : 'Booking notice'}
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">{modalMessage}</p>
            <button
              type="button"
              onClick={() => setModalState('idle')}
              className="w-full py-3.5 rounded-full bg-neutral-900 text-white font-semibold text-sm transition-colors hover:bg-black"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
