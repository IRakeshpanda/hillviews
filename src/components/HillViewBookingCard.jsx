import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import SmoobuBookingEmbed from './SmoobuBookingEmbed';

const useSearchParams = ReactRouterDOM.useSearchParams;
import { loadBookingSearch } from '../utils/bookingUtils';

export default function HillViewBookingCard({ className = '', initialSearchParams = null }) {
  let searchParams, setSearchParams;
  try {
    if (useSearchParams) {
      [searchParams, setSearchParams] = useSearchParams();
    }
  } catch {
    searchParams = null;
    setSearchParams = null;
  }
  if (initialSearchParams) {
    searchParams = initialSearchParams;
  } else if (!searchParams) {
    searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    setSearchParams = () => {};
  }

  // Load initial values from URL query parameters or sessionStorage
  const [initialState] = useState(() => loadBookingSearch(searchParams));

  const [checkIn, setCheckIn] = useState(initialState.checkIn || '');
  const [checkOut, setCheckOut] = useState(initialState.checkOut || '');
  const [guests, setGuests] = useState(initialState.guests || 2);

  // Sync state if searchParams change externally
  useEffect(() => {
    const loaded = loadBookingSearch(searchParams);
    if (loaded.hasFoundValues) {
      if (loaded.checkIn) setCheckIn(loaded.checkIn);
      if (loaded.checkOut) setCheckOut(loaded.checkOut);
      if (loaded.guests) setGuests(loaded.guests);
    }
  }, [searchParams]);

  return (
    <div className={`hillview-booking-card bg-white rounded-3xl border-2 border-neutral-900/10 shadow-2xl overflow-hidden ${className}`}>
      
      {/* Header bar */}
      <div className="bg-neutral-900 text-white p-5 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-neutral-400">
            Direct Reservation
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-400 text-[10px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Best Rate Guaranteed
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif-editorial font-bold text-white">
          Hill View Stone Cottage
        </h3>
        <p className="text-xs text-neutral-300 font-light mt-1">
          Reserve direct for the best rate and instant confirmation.
        </p>
      </div>

      {/* Embedded Smoobu Booking Tool pre-filled with selected dates & guests */}
      <div className="p-3 sm:p-4">
        <SmoobuBookingEmbed
          propertySlug="hill-view"
          checkIn={checkIn || null}
          checkOut={checkOut || null}
          guests={guests || 2}
        />
      </div>

    </div>
  );
}
