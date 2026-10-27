import { useState } from 'react';

const NIGHT_RATE = 185;
const CLEANING_FEE = 45;

export default function ChaletLeJoyauBookingForm() {
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const nights = arrivalDate && departureDate ? Math.max(0, Math.round((new Date(departureDate) - new Date(arrivalDate)) / (1000 * 60 * 60 * 24))) : 0;
  const subtotal = nights * NIGHT_RATE;
  const total = subtotal + CLEANING_FEE;

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
            Live Availability
          </span>
          <p className="text-[10px] text-neutral-400 mt-1">Zero booking fees</p>
        </div>
      </div>

      <form className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Check-in</label>
            <input
              type="date"
              value={arrivalDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(event) => setArrivalDate(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Check-out</label>
            <input
              type="date"
              value={departureDate}
              min={arrivalDate || new Date().toISOString().slice(0, 10)}
              onChange={(event) => setDepartureDate(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
          <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Adults</label>
          <select
            value={adults}
            onChange={(event) => setAdults(Number(event.target.value))}
            className="w-full bg-transparent text-sm text-neutral-900 outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map((value) => (
              <option key={value} value={value}>{value} adult{value > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
          <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Children</label>
          <select
            value={children}
            onChange={(event) => setChildren(Number(event.target.value))}
            className="w-full bg-transparent text-sm text-neutral-900 outline-none"
          >
            {[0, 1, 2, 3, 4].map((value) => (
              <option key={value} value={value}>{value} child{value === 1 ? '' : 'ren'}</option>
            ))}
          </select>
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
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Last name</label>
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
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
          type="button"
          className="w-full rounded-full bg-neutral-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Check availability
        </button>
      </form>
    </div>
  );
}
