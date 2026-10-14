import React, { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cottageRooms } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── Mobile Touch Slider ─────────────────────────────────────────────────────
function MobileRoomsSlider({ onOpenBooking }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = cottageRooms.length;

  // Touch tracking
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging  = useRef(false);

  const goTo = useCallback((index) => {
    const clamped = Math.max(0, Math.min(index, totalSlides - 1));
    setActiveIndex(clamped);
  }, [totalSlides]);

  const prev = () => goTo(activeIndex - 1);
  const next = () => goTo(activeIndex + 1);

  // Touch handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current  = true;
  };

  const handleTouchEnd = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    // Only register horizontal swipe if it's more horizontal than vertical
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) {
      dx < 0 ? next() : prev();
    }
  };

  const room = cottageRooms[activeIndex];

  return (
    <div className="relative">
      {/* Slide container */}
      <div
        className="relative overflow-hidden rounded-3xl shadow-xl border border-neutral-200/60 mx-0 select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Card image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
          {cottageRooms.map((r, i) => (
            <div
              key={r.id}
              className="absolute inset-0 transition-opacity duration-500 ease-out"
              style={{ opacity: i === activeIndex ? 1 : 0, pointerEvents: i === activeIndex ? 'auto' : 'none' }}
            >
              <img
                src={r.image}
                alt={r.title}
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Badge */}
              <span className="absolute top-4 right-4 backdrop-blur-md px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/90 border border-black/5 text-neutral-900 shadow-sm">
                {r.badge}
              </span>

              {/* Info overlay at bottom of image */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-serif-editorial font-semibold text-white drop-shadow">{r.title}</h3>
                <p className="text-xs text-white/90 font-light mt-1 drop-shadow">{r.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div
          className="p-4 bg-white flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-500 min-h-[52px] cursor-pointer active:bg-neutral-50 transition-colors"
          onClick={onOpenBooking}
        >
          <span>View Details & Rates</span>
          <span>→</span>
        </div>
      </div>

      {/* Navigation arrows + pill dots */}
      <div className="flex items-center justify-between mt-5 px-1">
        {/* Prev arrow */}
        <button
          onClick={prev}
          disabled={activeIndex === 0}
          className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all disabled:opacity-25 disabled:cursor-not-allowed active:scale-95"
          aria-label="Previous room"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dynamic pill dots */}
        <div className="flex items-center gap-1.5">
          {cottageRooms.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-7 bg-neutral-900'
                  : 'w-2 bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>

        {/* Next arrow */}
        <button
          onClick={next}
          disabled={activeIndex === totalSlides - 1}
          className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all disabled:opacity-25 disabled:cursor-not-allowed active:scale-95"
          aria-label="Next room"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide counter */}
      <p className="text-center text-xs text-neutral-400 uppercase tracking-widest mt-3 font-medium">
        {String(activeIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
      </p>
    </div>
  );
}

// ── Desktop Grid View ───────────────────────────────────────────────────────
export default function RoomsShowcase({ onOpenBooking }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Desktop: batch scroll reveal
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      ScrollTrigger.batch('.room-card', {
        onEnter: (elements) => {
          gsap.fromTo(elements,
            { opacity: 0, y: 50, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', overwrite: true }
          );
        },
        once: true,
        start: 'top 85%',
      });
    });

    // Mobile: staggered batch fade-up for feature cards (reused .feature-card pattern)
    mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.from(containerRef.current, {
        opacity: 0, y: 20, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 90%', once: true }
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.room-card', { clearProps: 'all' });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section id="rooms" ref={containerRef} className="bg-neutral-50 text-neutral-900 py-16 sm:py-20 md:py-28 lg:py-36 border-t border-neutral-200/60 overflow-x-hidden">
      <div className="px-5 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">

        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 md:mb-16 gap-4 sm:gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 block mb-2">
              ACCOMMODATION LAYOUT
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif-editorial font-medium tracking-tight text-neutral-900">
              The Rooms
            </h2>
          </div>
          <p className="text-sm text-neutral-500 font-light max-w-md">
            Four spacious bedrooms sleeping up to 8 guests, plus modern bathrooms and relaxing lounge quarters.
          </p>
        </div>

        {/* ── Mobile Slider (<lg) ── */}
        <div className="lg:hidden">
          <MobileRoomsSlider onOpenBooking={onOpenBooking} />
        </div>

        {/* ── Desktop Grid (≥lg) ── */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cottageRooms.map((room) => (
            <div
              key={room.id}
              onClick={onOpenBooking}
              className="room-card group cursor-pointer bg-white rounded-3xl overflow-hidden border border-neutral-200/60 hover:shadow-2xl hover:border-neutral-300 transition-all duration-500 shadow-md flex flex-col justify-between"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <span className="absolute top-4 right-4 backdrop-blur-md px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/90 border border-black/5 text-neutral-900 shadow-sm">
                  {room.badge}
                </span>

                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-serif-editorial font-semibold text-white drop-shadow">{room.title}</h3>
                  <p className="text-xs text-white/90 font-light mt-1 drop-shadow">{room.subtitle}</p>
                </div>
              </div>

              <div className="p-4 bg-white flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-500 group-hover:text-neutral-900 transition-colors min-h-[44px]">
                <span>View Details & Rates</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
