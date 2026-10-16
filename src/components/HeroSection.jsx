import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Calendar as CalendarIcon, ChevronDown, Search, Sparkles } from 'lucide-react';
import { cottageImages } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HeroSection({ onOpenBooking, arrivalDate, departureDate, guests }) {
  const containerRef     = useRef(null);
  // Desktop refs
  const heroOverlayRef   = useRef(null);
  const centerCardRef    = useRef(null);
  const leftColRef       = useRef(null);
  const rightColRef      = useRef(null);
  const mosaicWrapperRef = useRef(null);
  const subtitleRef      = useRef(null);

  // Mobile refs
  const mobileLeftCardRef  = useRef(null);
  const mobileRightCardRef = useRef(null);
  const mobileSubRef       = useRef(null);
  const mobileTrackRef     = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // ── DESKTOP ≥1024px: Pinned 5-card mosaic expansion ──────────────────
    mm.add('(min-width: 1024px)', () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=260%',
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      tl.to(heroOverlayRef.current, { opacity: 0, y: -30, pointerEvents: 'none', duration: 0.35, ease: 'power2.out' }, 0);
      tl.to(mosaicWrapperRef.current, { gap: '20px', padding: '40px 24px', duration: 0.6, ease: 'power2.inOut' }, 0.1);
      tl.to(centerCardRef.current, { width: '38%', borderRadius: '24px', duration: 0.6, ease: 'power2.inOut' }, 0.1);
      tl.to(leftColRef.current,  { width: '28%', xPercent: 0, opacity: 1, duration: 0.65, ease: 'power2.inOut' }, 0.15);
      tl.to(rightColRef.current, { width: '28%', xPercent: 0, opacity: 1, duration: 0.65, ease: 'power2.inOut' }, 0.15);
      tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.55);
    });

    // ── MOBILE / TABLET <1024px: Sequential viewport-width slide-in ───────
    mm.add('(max-width: 1023px)', () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const leftCard  = mobileLeftCardRef.current;
      const rightCard = mobileRightCardRef.current;
      const subtitle  = mobileSubRef.current;

      if (!leftCard || !rightCard) return;

      if (prefersReducedMotion) {
        gsap.set([leftCard, rightCard], { x: 0, opacity: 1 });
        if (subtitle) gsap.set(subtitle, { opacity: 1, y: 0 });
        return;
      }

      // Set initial off-screen state
      gsap.set(leftCard, { x: '-100vw', opacity: 0 });
      gsap.set(rightCard, { x: '100vw', opacity: 0 });
      if (subtitle) gsap.set(subtitle, { opacity: 0, y: 20 });

      const track = mobileTrackRef.current;

      // Left card slides in from screen left on scroll
      gsap.to(leftCard, {
        x: 0, opacity: 1, duration: 0.9, ease: 'power2.out',
        scrollTrigger: {
          trigger: track,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        }
      });

      // Right card slides in from screen right (slightly after left)
      gsap.to(rightCard, {
        x: 0, opacity: 1, duration: 0.9, ease: 'power2.out',
        scrollTrigger: {
          trigger: track,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        }
      });

      // Subtitle fades up after cards
      if (subtitle) {
        gsap.to(subtitle, {
          opacity: 1, y: 0, duration: 0.65, ease: 'power2.out',
          scrollTrigger: {
            trigger: subtitle,
            start: 'top 92%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          }
        });
      }

      ScrollTrigger.refresh();
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-white text-neutral-900">

      {/* ══ MOBILE / TABLET Hero (<lg) ══════════════════════════════════════ */}
      <section
        id="hero-mobile-section"
        className="lg:hidden relative w-full bg-white"
      >
        {/* 1. Hero Main Image & Title — full viewport */}
        <div className="hero-main-container relative w-full h-[85vh] rounded-b-3xl overflow-hidden bg-neutral-900">
          <img
            src={cottageImages.livingRoom}
            alt="Hill View Hero"
            className="w-full h-full object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-semibold uppercase tracking-widest mb-3 self-start">
              <Sparkles className="w-3 h-3 text-white/90" />
              <span>Low Row • Swaledale</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif-editorial font-medium leading-tight text-white drop-shadow-md">
              Spacious Yorkshire Dales Stone Cottage
            </h1>
            <p className="text-sm text-neutral-300 mt-2 font-serif-editorial italic">
              Book direct with us and save.
            </p>

            {/* Mobile Booking Bar */}
            <div className="mt-5 bg-white/10 backdrop-blur-xl rounded-2xl p-3.5 border border-white/20 shadow-2xl">
              <div className="grid grid-cols-2 gap-2.5 mb-2.5">
                <button
                  onClick={onOpenBooking}
                  className="flex flex-col items-start px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left min-h-[48px] transition-all active:scale-[0.98]"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">Arrival</span>
                  <span className="text-sm font-medium text-white">{arrivalDate || '24 Sep 2026'}</span>
                </button>
                <button
                  onClick={onOpenBooking}
                  className="flex flex-col items-start px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left min-h-[48px] transition-all active:scale-[0.98]"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">Departure</span>
                  <span className="text-sm font-medium text-white">{departureDate || '28 Sep 2026'}</span>
                </button>
              </div>
              <button
                onClick={onOpenBooking}
                className="w-full py-3.5 rounded-xl bg-white text-neutral-900 font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all min-h-[48px]"
              >
                <Search className="w-4 h-4" />
                <span>Check Availability</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Sliding Cards Track — overflow-hidden clips off-screen cards */}
        <div
          ref={mobileTrackRef}
          className="hero-sliding-track relative w-full overflow-hidden px-4 py-8 space-y-4 bg-white"
          style={{ isolation: 'isolate' }}
        >
          {/* Left card — initially x: -100vw, slides in from left */}
          <div
            ref={mobileLeftCardRef}
            className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-neutral-200 bg-neutral-100 will-change-transform"
            style={{ transform: 'translateX(-100vw)', opacity: 0 }}
          >
            <img
              src={cottageImages.hero}
              alt="Hill View Stone Cottage"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
              Stone Cottage Exterior
            </span>
          </div>

          {/* Right card — initially x: 100vw, slides in from right */}
          <div
            ref={mobileRightCardRef}
            className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-neutral-200 bg-neutral-100 will-change-transform"
            style={{ transform: 'translateX(100vw)', opacity: 0 }}
          >
            <img
              src={cottageImages.terrace}
              alt="Swaledale Terrace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
              Swaledale Terrace Views
            </span>
          </div>

          {/* Subtitle — fades up after both cards */}
          <p
            ref={mobileSubRef}
            className="mx-auto mt-2 w-full max-w-md text-center text-sm sm:text-base text-neutral-600 px-4 font-medium leading-relaxed tracking-[0.02em]"
            style={{ opacity: 0, transform: 'translateY(20px)' }}
          >
            <span className="block text-neutral-700">A spacious Yorkshire Dales stone cottage.</span>
            <span className="mt-1 block text-neutral-900 font-semibold tracking-[0.04em] uppercase text-[11px] sm:text-[12px]">Book direct with us and save.</span>
          </p>
        </div>
      </section>

      {/* ══ DESKTOP Hero (≥lg): Pinned 5-card mosaic ════════════════════════ */}
      <div className="hidden lg:block">
        <div className="h-screen w-full overflow-hidden flex flex-col justify-between items-center relative">
          <div
            ref={mosaicWrapperRef}
            className="relative flex h-full w-full items-stretch justify-center transition-all duration-300 transform-gpu"
            style={{ gap: '0px', padding: '0px' }}
          >
            {/* Left Column */}
            <div
              ref={leftColRef}
              className="flex flex-col will-change-transform gap-4"
              style={{ width: '0%', transform: 'translateX(-100%)', opacity: 0 }}
            >
              <div className="relative flex-1 overflow-hidden rounded-3xl border border-neutral-200/60 shadow-2xl group">
                <img src={cottageImages.hero} alt="Hill View stone cottage exterior" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md px-3 py-1 rounded-full bg-black/50 border border-white/20">Low Row Exterior</span>
              </div>
              <div className="relative flex-1 overflow-hidden rounded-3xl border border-neutral-200/60 shadow-2xl group">
                <img src={cottageImages.terrace} alt="Terrace with Yorkshire Dales views" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md px-3 py-1 rounded-full bg-black/50 border border-white/20">Swaledale Terrace</span>
              </div>
            </div>

            {/* Center Column */}
            <div
              ref={centerCardRef}
              className="relative overflow-hidden will-change-transform shadow-2xl border border-neutral-200/60"
              style={{ width: '100%', height: '100%', flex: '0 0 auto', borderRadius: '0px' }}
            >
              <img src={cottageImages.livingRoom} alt="Hill View living room with wood-burning stove" className="absolute inset-0 w-full h-full object-cover object-center scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />

              <div
                ref={heroOverlayRef}
                className="absolute inset-0 z-10 flex items-center justify-center px-6 py-12"
              >
                <div className="w-full max-w-5xl text-center flex flex-col items-center justify-center">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium uppercase tracking-widest shadow-lg">
                      <Sparkles className="w-3.5 h-3.5 text-white/90" />
                      <span>Low Row • Swaledale</span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl xl:text-7xl font-serif-editorial font-medium tracking-tight text-white drop-shadow-md leading-[1.08]">
                      Spacious Yorkshire Dales Stone Cottage
                    </h1>
                    <p className="text-xl lg:text-2xl font-serif-editorial italic text-white/90 font-light drop-shadow">
                      Book direct with us and save!
                    </p>
                  </div>

                  {/* Desktop Booking Bar */}
                  <div className="mt-8 w-full max-w-4xl glass-panel rounded-3xl p-4 md:p-6 shadow-2xl border border-white/20 backdrop-blur-xl">
                    <form onSubmit={(e) => { e.preventDefault(); onOpenBooking(); }} className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
                      <div className="flex-1 text-left">
                        <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/70 mb-2">Arrival</label>
                        <div onClick={onOpenBooking} className="flex items-center justify-between w-full px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm text-white cursor-pointer transition-all group min-h-[44px]">
                          <span className="font-medium">{arrivalDate || '24 Sep 2026'}</span>
                          <CalendarIcon className="w-4 h-4 text-white/80 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                      <div className="flex-1 text-left">
                        <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/70 mb-2">Departure</label>
                        <div onClick={onOpenBooking} className="flex items-center justify-between w-full px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm text-white cursor-pointer transition-all group min-h-[44px]">
                          <span className="font-medium">{departureDate || '28 Sep 2026'}</span>
                          <CalendarIcon className="w-4 h-4 text-white/80 group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                      <div className="flex-1 text-left">
                        <label className="block text-[10px] font-semibold uppercase tracking-widest text-white/70 mb-2">Guests</label>
                        <div onClick={onOpenBooking} className="flex items-center justify-between w-full px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm text-white cursor-pointer transition-all group min-h-[44px]">
                          <span className="font-medium">{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
                          <ChevronDown className="w-4 h-4 text-white/80 group-hover:translate-y-0.5 transition-transform" />
                        </div>
                      </div>
                      <button type="submit" className="md:self-end px-8 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-neutral-900 font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2 active:scale-95 min-h-[44px]">
                        <Search className="w-4 h-4" />
                        <span>Search</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div
              ref={rightColRef}
              className="flex flex-col will-change-transform gap-4"
              style={{ width: '0%', transform: 'translateX(100%)', opacity: 0 }}
            >
              <div className="relative flex-1 overflow-hidden rounded-3xl border border-neutral-200/60 shadow-2xl group">
                <img src={cottageImages.diningRoom} alt="Beamed dining room" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md px-3 py-1 rounded-full bg-black/50 border border-white/20">Beamed Dining</span>
              </div>
              <div className="relative flex-1 overflow-hidden rounded-3xl border border-neutral-200/60 shadow-2xl group">
                <img src={cottageImages.beamedDouble} alt="Cosy double bedroom" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md px-3 py-1 rounded-full bg-black/50 border border-white/20">Double Bedroom</span>
              </div>
            </div>
          </div>

          {/* Desktop Subtitle Reveal */}
          <div
            ref={subtitleRef}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center opacity-0 translate-y-6 w-full max-w-2xl px-6 pointer-events-none"
          >
            <p className="text-2xl lg:text-3xl font-serif-editorial italic text-neutral-600 drop-shadow-sm">
              A spacious Yorkshire Dales stone cottage. Book direct with us and save.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
