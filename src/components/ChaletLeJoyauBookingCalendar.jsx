import { useEffect, useMemo, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const parseLocalDate = (value) => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toLocalDateString = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

export default function ChaletLeJoyauBookingCalendar({ range, onSelect, blockedDates }) {
  const [visibleMonths, setVisibleMonths] = useState(1);
  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const updateVisibleMonths = () => setVisibleMonths(mediaQuery.matches ? 2 : 1);

    updateVisibleMonths();
    mediaQuery.addEventListener('change', updateVisibleMonths);

    return () => mediaQuery.removeEventListener('change', updateVisibleMonths);
  }, []);

  const blockedDateObjects = useMemo(
    () =>
      blockedDates
        .map((value) => {
          const parsed = parseLocalDate(value);
          return parsed ? new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()) : null;
        })
        .filter(Boolean),
    [blockedDates],
  );

  const rangeContainsBookedNight = Boolean(
    range?.from && range?.to && containsBlockedNight(range.from, range.to, blockedDates),
  );

  return (
    <div className="mb-5">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold block">Availability</label>
        <div className="flex items-center gap-3 text-[10px] text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm border border-neutral-300 bg-rose-600" />
            Booked
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm border border-neutral-300 bg-white" />
            Available
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-2 sm:p-3">
        <DayPicker
          mode="range"
          selected={range}
          onSelect={onSelect}
          min={1}
          disabled={[{ before: today }, ...blockedDateObjects]}
          excludeDisabled
          modifiers={{ booked: blockedDateObjects }}
          modifiersClassNames={{ booked: 'booked-day' }}
          numberOfMonths={visibleMonths}
          fromMonth={new Date(today.getFullYear(), today.getMonth(), 1)}
          className="mx-auto"
          classNames={{
            months: 'flex flex-col md:flex-row md:gap-5',
            month: 'flex-1',
            caption: 'flex justify-center items-center relative mb-3',
            caption_label: 'text-sm font-semibold text-neutral-900',
            nav: 'absolute inset-0 flex items-center justify-between pointer-events-none',
            nav_button: 'pointer-events-auto inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-700 shadow-sm border border-neutral-200 hover:bg-neutral-100',
            table: 'w-full border-collapse',
            head_cell: 'text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold',
            cell: 'p-0',
            day: 'h-9 w-9 rounded-full text-sm text-neutral-700 hover:bg-neutral-200 focus:outline-none',
            day_selected: 'bg-neutral-900 text-white rounded-full',
            day_today: 'font-semibold text-neutral-900',
            day_outside: 'text-neutral-300',
            day_disabled: 'text-neutral-300 cursor-not-allowed',
          }}
        />
      </div>

      <style>{`
        .rdp .booked-day,
        .rdp .booked-day:hover,
        .rdp .booked-day:focus {
          background-color: #dc2626 !important;
          color: #fff !important;
          text-decoration: line-through !important;
          cursor: not-allowed !important;
          pointer-events: none !important;
          opacity: 1 !important;
        }

        .rdp .day_range_middle,
        .rdp .day_range_start,
        .rdp .day_range_end {
          border-radius: 9999px !important;
        }
      `}</style>

      {rangeContainsBookedNight && (
        <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          Those dates include a booked night — please pick another range.
        </div>
      )}
    </div>
  );
}
