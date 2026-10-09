import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Calendar as CalendarIcon, ChevronDown, Search, Sparkles } from 'lucide-react';
import { cottageImages } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HeroSection({ onOpenBooking, arrivalDate, departureDate, guests }) {
  const containerRef = useRef(null);
  const heroOverlayRef = useRef(null);
  const centerCardRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const mosaicWrapperRef = useRef(null);
  const subtitleRef = useRef(null);

  useGSAP(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Master Pinned Hero 5-Card Mosaic Scroll Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=180%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // Step 1: Fade out text overlay & booking bar
    tl.to(heroOverlayRef.current, {
      opacity: 0,
      y: -30,
      pointerEvents: 'none',
      duration: 0.35,
      ease: 'power2.out'
    }, 0);

    // Step 2: Scale/Shrink center card & adjust layout container gap
    tl.to(mosaicWrapperRef.current, {
      gap: '20px',
      padding: '40px 24px',
      duration: 0.6,
      ease: 'power2.inOut'
    }, 0.1);

    tl.to(centerCardRef.current, {
      width: '38%',
      borderRadius: '24px',
      duration: 0.6,
      ease: 'power2.inOut'
    }, 0.1);

    // Step 3: Expand Left & Right columns to form the 5-card mosaic layout
    tl.to(leftColRef.current, {
      width: '28%',
      xPercent: 0,
      opacity: 1,
      duration: 0.65,
      ease: 'power2.inOut'
    }, 0.15);

    tl.to(rightColRef.current, {
      width: '28%',
      xPercent: 0,
      opacity: 1,
      duration: 0.65,
      ease: 'power2.inOut'
    }, 0.15);

    // Step 4: Fade & slide up subtitle statement below mosaic
    tl.to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.55);

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-white text-neutral-900">
      {/* Pinned Viewport Container */}
      <div className="h-screen w-full overflow-hidden flex flex-col justify-between items-center relative">
        
        {/* 5-Card Mosaic Flex Wrapper */}
        <div 
          ref={mosaicWrapperRef}
          className="relative flex h-full w-full items-stretch justify-center transition-all duration-300 transform-gpu"
          style={{ gap: '0px', padding: '0px' }}
        >
          {/* Left Column (2 Stacked Cards: Cottage Exterior & Terrace) */}
          <div 
            ref={leftColRef}
            className="hidden md:flex flex-col will-change-transform gap-4"
            style={{ width: '0%', transform: 'translateX(-100%)', opacity: 0 }}
          >
            <div className="relative flex-1 overflow-hidden rounded-3xl border border-neutral-200/60 shadow-2xl group">
              <img
                src={cottageImages.hero}
                alt="Hill View stone cottage exterior"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md px-3 py-1 rounded-full bg-black/50 border border-white/20">
                Low Row Exterior
              </span>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-3xl border border-neutral-200/60 shadow-2xl group">
              <img
                src={cottageImages.terrace}
                alt="Terrace with Yorkshire Dales views"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md px-3 py-1 rounded-full bg-black/50 border border-white/20">
                Swaledale Terrace
              </span>
            </div>
          </div>

          {/* Center Column (Prominent Hero Center Image + Overlay) */}
          <div 
            ref={centerCardRef}
            className="relative overflow-hidden will-change-transform shadow-2xl border border-neutral-200/60"
            style={{ width: '100%', height: '100%', flex: '0 0 auto', borderRadius: '0px' }}
          >
            <img
              src={cottageImages.livingRoom}
              alt="Hill View living room with wood-burning stove"
              className="absolute inset-0 w-full h-full object-cover object-center scale-105"
            />
            
            {/* Dark Scrim & Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />

            {/* Hero Text & Glassmorphic Booking Widget Overlay */}
            <div 
              ref={heroOverlayRef}
              className="absolute inset-0 flex flex-col items-center justify-between px-6 pt-36 pb-12 md:pt-40 md:pb-16 max-w-4xl mx-auto text-center z-10"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium uppercase tracking-widest shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-white/90" />
                  <span>Low Row • Swaledale</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif-editorial font-medium tracking-tight text-white drop-shadow-md leading-[1.08]">
                  Spacious Yorkshire Dales Stone Cottage
                </h1>

                <p className="text-lg md:text-2xl font-serif-editorial italic text-white/90 font-light drop-shadow">
                  Book direct with us and save!
                </p>
              </div>

              {/* Booking Bar */}
              <div className="w-full max-w-3xl glass-panel rounded-3xl p-4 md:p-6 shadow-2xl border border-white/20 backdrop-blur-xl">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    onOpenBooking();
                  }}
                  className="flex flex-col md:flex-row items-stretch md:items-end gap-4"
                >
                  <div className="flex-1 text-left">
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/70 mb-2">
                      Arrival
                    </label>
                    <div 
                      onClick={onOpenBooking}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm text-white cursor-pointer transition-all duration-200 group"
                    >
                      <span className="font-medium text-white">{arrivalDate || '24 Sep 2026'}</span>
                      <CalendarIcon className="w-4 h-4 text-white/80 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <div className="flex-1 text-left">
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/70 mb-2">
                      Departure
                    </label>
                    <div 
                      onClick={onOpenBooking}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm text-white cursor-pointer transition-all duration-200 group"
                    >
                      <span className="font-medium text-white">{departureDate || '28 Sep 2026'}</span>
                      <CalendarIcon className="w-4 h-4 text-white/80 group-hover:scale-110 transition-transform" />
                    </div>
                  </div>

                  <div className="flex-1 text-left">
                    <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/70 mb-2">
                      Guests
                    </label>
                    <div 
                      onClick={onOpenBooking}
                      className="flex items-center justify-between w-full px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm text-white cursor-pointer transition-all duration-200 group"
                    >
                      <span className="font-medium text-white">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                      <ChevronDown className="w-4 h-4 text-white/80 group-hover:translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-neutral-900 font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Search className="w-4 h-4 text-neutral-900" />
                    <span>Search</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column (2 Stacked Cards: Dining Room & Beamed Bedroom) */}
          <div 
            ref={rightColRef}
            className="hidden md:flex flex-col will-change-transform gap-4"
            style={{ width: '0%', transform: 'translateX(100%)', opacity: 0 }}
          >
            <div className="relative flex-1 overflow-hidden rounded-3xl border border-neutral-200/60 shadow-2xl group">
              <img
                src={cottageImages.diningRoom}
                alt="Beamed dining room"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md px-3 py-1 rounded-full bg-black/50 border border-white/20">
                Beamed Dining
              </span>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-3xl border border-neutral-200/60 shadow-2xl group">
              <img
                src={cottageImages.beamedDouble}
                alt="Cosy double bedroom"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md px-3 py-1 rounded-full bg-black/50 border border-white/20">
                Double Bedroom
              </span>
            </div>
          </div>

        </div>

        {/* Subtitle statement reveal resting at bottom of pinned container */}
        <div 
          ref={subtitleRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center opacity-0 translate-y-6 w-full max-w-2xl px-6 pointer-events-none"
        >
          <p className="text-2xl md:text-3xl font-serif-editorial italic text-neutral-600 drop-shadow-sm">
            A spacious Yorkshire Dales stone cottage. Book direct with us and save.
          </p>
        </div>

      </div>
    </section>
  );
}
