import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as ReactRouterDOM from 'react-router-dom';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Calendar, Users, AlertCircle, Plus, Minus, ArrowRight } from 'lucide-react';

const useNavigate = ReactRouterDOM.useNavigate;
import {
  MAX_GUESTS,
  MIN_GUESTS,
  addDaysIso,
  formatDisplayDate,
  calculateNights,
  saveBookingSearch,
} from '../utils/bookingUtils';

export default function BookingSearchForm({
  variant = 'hero', // 'hero' | 'section' | 'compact' | 'mobile-hero'
  className = '',
  buttonLabel = 'Check Dates',
  onSearch = null,
}) {
  let navigate = null;
  try {
    navigate = useNavigate ? useNavigate() : null;
  } catch {
    navigate = null;
  }
  if (!navigate) {
    navigate = (url) => {
      if (typeof window !== 'undefined') {
        window.location.href = url;
      }
    };
  }

  // Search forms always start fresh with empty dates so users can freely select
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const [dateError, setDateError] = useState('');
  const [guestError, setGuestError] = useState('');
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 288 });

  const rangeInputRef = useRef(null);
  const flatpickrInstance = useRef(null);
  const guestDropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute fixed position for portaled guest dropdown
  useEffect(() => {
    if (!guestDropdownOpen || !guestDropdownRef.current) return;

    const updateCoords = () => {
      if (!guestDropdownRef.current) return;
      const rect = guestDropdownRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      const width = isMobile ? Math.min(288, window.innerWidth - 32) : 288;
      let left = rect.left;
      if (left + width > window.innerWidth - 16) {
        left = window.innerWidth - width - 16;
      }
      if (left < 16) left = 16;

      setDropdownCoords({
        top: rect.bottom + 8,
        left,
        width,
      });
    };

    updateCoords();
    window.addEventListener('resize', updateCoords);
    window.addEventListener('scroll', updateCoords, true);
    return () => {
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords, true);
    };
  }, [guestDropdownOpen]);

  // Initialize Flatpickr range picker
  useEffect(() => {
    if (!rangeInputRef.current) return;

    const fp = flatpickr(rangeInputRef.current, {
      mode: 'range',
      minDate: 'today',
      dateFormat: 'Y-m-d',
      showMonths: typeof window !== 'undefined' && window.innerWidth >= 768 ? 2 : 1,
      defaultDate: checkIn && checkOut ? [checkIn, checkOut] : checkIn ? [checkIn] : [],
      disableMobile: true, // Use Flatpickr UI on mobile for consistent range highlighting
      locale: {
        firstDayOfWeek: 1,
      },
      onChange: (selectedDates) => {
        setDateError('');

        if (selectedDates.length === 2) {
          const d1 = selectedDates[0];
          const d2 = selectedDates[1];

          const y1 = d1.getFullYear();
          const m1 = String(d1.getMonth() + 1).padStart(2, '0');
          const day1 = String(d1.getDate()).padStart(2, '0');
          const iso1 = `${y1}-${m1}-${day1}`;

          let y2 = d2.getFullYear();
          let m2 = String(d2.getMonth() + 1).padStart(2, '0');
          let day2 = String(d2.getDate()).padStart(2, '0');
          let iso2 = `${y2}-${m2}-${day2}`;

          // Automatically enforce at least 1 night after check-in
          if (iso2 <= iso1) {
            iso2 = addDaysIso(iso1, 1);
          }

          setCheckIn(iso1);
          setCheckOut(iso2);

          // Close Flatpickr automatically after selecting both dates so it doesn't block guests or submit button
          setTimeout(() => {
            if (flatpickrInstance.current) {
              flatpickrInstance.current.close();
            }
          }, 150);
        } else if (selectedDates.length === 1) {
          const d1 = selectedDates[0];
          const y1 = d1.getFullYear();
          const m1 = String(d1.getMonth() + 1).padStart(2, '0');
          const day1 = String(d1.getDate()).padStart(2, '0');
          const iso1 = `${y1}-${m1}-${day1}`;

          setCheckIn(iso1);
          setCheckOut('');
        } else {
          setCheckIn('');
          setCheckOut('');
        }
      },
      onClose: () => {
        if (rangeInputRef.current) {
          rangeInputRef.current.blur();
        }
      },
    });

    flatpickrInstance.current = fp;

    return () => {
      fp.destroy();
    };
  }, []);

  // Close guest dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(e.target) &&
        !e.target.closest?.('[role="dialog"][aria-label="Guests selector"]')
      ) {
        setGuestDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openCalendar = () => {
    // Close guest dropdown when opening calendar
    setGuestDropdownOpen(false);
    if (flatpickrInstance.current) {
      flatpickrInstance.current.open();
    }
  };

  const handleToggleGuests = () => {
    // Close calendar when toggling guest dropdown
    if (flatpickrInstance.current?.isOpen) {
      flatpickrInstance.current.close();
    }
    setGuestDropdownOpen((prev) => !prev);
  };

  const handleIncrementGuests = () => {
    if (guests >= MAX_GUESTS) {
      setGuestError('Maximum 6 guests allowed');
      return;
    }
    setGuestError('');
    setGuests((prev) => Math.min(MAX_GUESTS, prev + 1));
  };

  const handleDecrementGuests = () => {
    setGuestError('');
    setGuests((prev) => Math.max(MIN_GUESTS, prev - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Close any open popups
    if (flatpickrInstance.current?.isOpen) {
      flatpickrInstance.current.close();
    }
    setGuestDropdownOpen(false);

    let hasError = false;

    // Validate dates
    if (!checkIn || !checkOut) {
      setDateError('Please select both check-in and check-out dates.');
      openCalendar();
      hasError = true;
    } else if (checkOut <= checkIn) {
      setDateError('Check-out must be at least 1 night after check-in.');
      openCalendar();
      hasError = true;
    } else {
      setDateError('');
    }

    // Validate guests
    if (guests > MAX_GUESTS) {
      setGuestError('Maximum 6 guests allowed');
      hasError = true;
    } else if (guests < MIN_GUESTS) {
      setGuests(MIN_GUESTS);
    } else {
      setGuestError('');
    }

    if (hasError) return;

    // Save values for persistence fallback
    saveBookingSearch({ checkIn, checkOut, guests });

    if (onSearch) {
      onSearch({ checkIn, checkOut, guests });
    }

    // Redirect to Hill View cottage booking form with query parameters
    const query = new URLSearchParams({
      checkin: checkIn,
      checkout: checkOut,
      guests: String(guests),
    });

    navigate(`/hill-view-cottage?${query.toString()}#booking-form`);
  };

  const nights = calculateNights(checkIn, checkOut);

  // Variant styling configs
  const isHero = variant === 'hero' || variant === 'mobile-hero';

  // Guest dropdown popover content
  const guestDropdownContent = (
    <div
      style={
        mounted
          ? {
              position: 'fixed',
              top: `${dropdownCoords.top}px`,
              left: `${dropdownCoords.left}px`,
              width: `${dropdownCoords.width}px`,
              zIndex: 999999,
            }
          : undefined
      }
      className="bg-white rounded-2xl shadow-2xl border border-neutral-200/90 p-4 space-y-3 animate-fadeIn text-neutral-900"
      role="dialog"
      aria-label="Guests selector"
    >
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div>
          <h4 className="text-sm font-bold text-neutral-900">Total Guests</h4>
          <p className="text-[11px] text-neutral-500">Maximum capacity 6 guests</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDecrementGuests}
            disabled={guests <= MIN_GUESTS}
            className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Decrease guests"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center font-bold text-sm text-neutral-900">
            {guests}
          </span>
          <button
            type="button"
            onClick={handleIncrementGuests}
            disabled={guests >= MAX_GUESTS}
            className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Increase guests"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {guestError && (
        <div className="text-[11px] text-rose-600 font-medium flex items-center gap-1.5 bg-rose-50 border border-rose-200/60 rounded-lg p-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{guestError}</span>
        </div>
      )}

      <div className="pt-1 flex justify-end">
        <button
          type="button"
          onClick={() => setGuestDropdownOpen(false)}
          className="px-4 py-1.5 text-xs font-semibold rounded-full bg-neutral-900 text-white hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );

  return (
    <div className={`booking-search-form w-full ${className}`}>
      <form onSubmit={handleSubmit} noValidate>
        {/* Hidden Flatpickr input */}
        <input
          ref={rangeInputRef}
          type="text"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />

        {/* Form Container Grid - 4 items in 1 line on desktop, 2 in a row on mobile */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-2xl ${
            isHero
              ? 'bg-white/85 md:bg-white/90 backdrop-blur-xl border border-white/60 shadow-lg'
              : 'bg-white border border-neutral-200/90 shadow-md'
          }`}
        >
          {/* 1. Check-in Trigger */}
          <div
            onClick={openCalendar}
            className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-neutral-100/80 transition-colors cursor-pointer group select-none min-h-[54px] sm:min-h-[58px]"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest font-semibold text-neutral-400 truncate">
                Check-in
              </span>
              <span className="block text-xs sm:text-sm font-medium text-neutral-900 truncate">
                {checkIn ? formatDisplayDate(checkIn, { includeDay: true, includeYear: false }) : 'Add date'}
              </span>
            </div>
          </div>

          {/* 2. Check-out Trigger */}
          <div
            onClick={openCalendar}
            className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-neutral-100/80 transition-colors cursor-pointer group select-none min-h-[54px] sm:min-h-[58px]"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest font-semibold text-neutral-400 truncate">
                Check-out {nights > 0 ? `(${nights}n)` : ''}
              </span>
              <span className="block text-xs sm:text-sm font-medium text-neutral-900 truncate">
                {checkOut ? formatDisplayDate(checkOut, { includeDay: true, includeYear: false }) : 'Add date'}
              </span>
            </div>
          </div>

          {/* 3. Guests Selector Trigger & Dropdown */}
          <div ref={guestDropdownRef} className="relative">
            <div
              onClick={handleToggleGuests}
              className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-neutral-100/80 transition-colors cursor-pointer group select-none min-h-[54px] sm:min-h-[58px]"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors shrink-0">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <span className="block text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest font-semibold text-neutral-400 truncate">
                  Guests
                </span>
                <span className="block text-xs sm:text-sm font-medium text-neutral-900 truncate">
                  {guests} {guests === 1 ? 'Guest' : 'Guests'} (max 6)
                </span>
              </div>
            </div>

            {/* Guest Popover Dropdown (portaled to document.body on client to avoid clipping or stacking issues) */}
            {guestDropdownOpen && (
              mounted && typeof document !== 'undefined'
                ? createPortal(guestDropdownContent, document.body)
                : (
                    <div className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 md:left-0 w-72 max-w-[calc(100vw-2.5rem)] z-[999999]">
                      {guestDropdownContent}
                    </div>
                  )
            )}
          </div>

          {/* 4. Action Button: Check Dates - aligned in same row on desktop, row 2 on mobile */}
          <div className="flex items-center">
            <button
              type="submit"
              className="w-full h-full min-h-[54px] sm:min-h-[58px] px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-[0.98] text-white text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-md hover:shadow-xl cursor-pointer"
            >
              <span className="truncate">{buttonLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            </button>
          </div>
        </div>

        {/* Validation Errors */}
        {(dateError || guestError) && (
          <div className="mt-2.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-center gap-2 text-left animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{dateError || guestError}</span>
          </div>
        )}
      </form>
    </div>
  );
}
