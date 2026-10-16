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

    // ── MOBILE / TABLET <1024px: Full-viewport hero + sequential slide-in ─
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

      gsap.set(leftCard, { x: '-100vw', opacity: 0 });
      gsap.set(rightCard, { x: '100vw', opacity: 0 });
      if (subtitle) gsap.set(subtitle, { opacity: 0, y: 25 });

      const track = mobileTrackRef.current;

      gsap.fromTo(
        leftCard,
        { x: '-100vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: track,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          }
        }
      );

      gsap.fromTo(
        rightCard,
        { x: '100vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: track,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          }
        }
      );

      if (subtitle) {
        gsap.fromTo(
          subtitle,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: subtitle,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            }
          }
        );
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
        className="lg:hidden relative w-full bg-black overflow-hidden"
      >
        <div className="relative w-full h-[100dvh] min-h-[100dvh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={cottageImages.hero}
              alt="Hill View Stone Cottage"
              className="w-full h-full object-cover brightness-[0.82]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/75" />
          </div>

          <div className="relative z-10 w-full max-w-sm px-6 text-center text-white flex flex-col items-center justify-center">
            <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-300 font-semibold mb-2">
              Swaledale • Yorkshire Dales
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Spacious Yorkshire Dales Stone Cottage
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-200 font-light italic text-amber-200/90">
              Book direct with us and save.
            </p>

            <div className="mt-6 w-full p-4 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-2xl space-y-3 text-left">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onOpenBooking}
                  className="p-2.5 rounded-xl bg-white/20 border border-white/20 text-xs text-left transition-transform active:scale-[0.98]"
                >
                  <span className="text-[9px] uppercase font-bold text-neutral-300 block">ARRIVAL</span>
                  <span className="font-medium text-white text-[11px]">{arrivalDate || 'Select Date'}</span>
                </button>
                <button
                  onClick={onOpenBooking}
                  className="p-2.5 rounded-xl bg-white/20 border border-white/20 text-xs text-left transition-transform active:scale-[0.98]"
                >
                  <span className="text-[9px] uppercase font-bold text-neutral-300 block">DEPARTURE</span>
                  <span className="font-medium text-white text-[11px]">{departureDate || 'Select Date'}</span>
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-white/20 border border-white/20 text-xs flex justify-between items-center">
                <span className="text-[9px] uppercase font-bold text-neutral-300">GUESTS</span>
                <span className="font-medium text-white text-[11px]">Up to {guests || 6} Guests</span>
              </div>

              <button
                onClick={onOpenBooking}
                className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95"
              >
                <span>Check Availability</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 text-white/60 text-[10px] tracking-widest uppercase flex flex-col items-center gap-1 animate-bounce">
            <span>Scroll</span>
            <span>↓</span>
          </div>
        </div>

        <div ref={mobileTrackRef} className="hero-mobile-scroll-track relative w-full px-5 py-12 space-y-6 bg-white">
          <div
            ref={mobileLeftCardRef}
            className="hero-mob-card-left relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-neutral-200/80 bg-neutral-100"
          >
            <img src={cottageImages.livingRoom} alt="Living Room Fireside" className="w-full h-full object-cover" />
            <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
              Beamed Living Room
            </span>
          </div>

          <div
            ref={mobileRightCardRef}
            className="hero-mob-card-right relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-neutral-200/80 bg-neutral-100"
          >
            <img src={cottageImages.diningRoom} alt="Dining Room" className="w-full h-full object-cover" />
            <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
              Equipped Kitchen & Dining
            </span>
          </div>

          <div ref={mobileSubRef} className="hero-mob-reveal-text text-center px-4 pt-4">
            <p className="text-lg font-bold tracking-tight text-neutral-900 leading-snug">
              A spacious Yorkshire Dales stone cottage.
            </p>
            <p className="text-sm text-neutral-600 mt-1">
              Book direct with us and save.
            </p>
          </div>
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
              className="hero-center-card relative overflow-hidden will-change-transform shadow-2xl border border-neutral-200/60"
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

              <div
                ref={subtitleRef}
                className="hero-mosaic-reveal-text absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center opacity-0 translate-y-6 w-full max-w-2xl px-6 pointer-events-none"
              >
                <p className="text-2xl lg:text-3xl font-serif-editorial italic text-neutral-600 drop-shadow-sm">
                  A spacious Yorkshire Dales stone cottage. Book direct with us and save.
                </p>
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


        </div>
      </div>

    </section>
  );
}
