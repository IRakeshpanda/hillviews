import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Calendar as CalendarIcon, ChevronDown, Search, Sparkles } from 'lucide-react';
import { cottageImages } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HeroSection({ onOpenBooking, arrivalDate, departureDate, guests }) {
  const containerRef     = useRef(null);
  const heroOverlayRef   = useRef(null);
  const centerCardRef    = useRef(null);
  const leftColRef       = useRef(null);
  const rightColRef      = useRef(null);
  const mosaicWrapperRef = useRef(null);
  const subtitleRef      = useRef(null);

  // Mobile-specific refs
  const mobileHeroRef    = useRef(null);
  const mobileLeftRef    = useRef(null);
  const mobileRightRef   = useRef(null);
  const mobileSubRef     = useRef(null);

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
          end: '+=180%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      tl.to(heroOverlayRef.current, {
        opacity: 0, y: -30, pointerEvents: 'none', duration: 0.35, ease: 'power2.out'
      }, 0);

      tl.to(mosaicWrapperRef.current, {
        gap: '20px', padding: '40px 24px', duration: 0.6, ease: 'power2.inOut'
      }, 0.1);

      tl.to(centerCardRef.current, {
        width: '38%', borderRadius: '24px', duration: 0.6, ease: 'power2.inOut'
      }, 0.1);

      tl.to(leftColRef.current, {
        width: '28%', xPercent: 0, opacity: 1, duration: 0.65, ease: 'power2.inOut'
      }, 0.15);

      tl.to(rightColRef.current, {
        width: '28%', xPercent: 0, opacity: 1, duration: 0.65, ease: 'power2.inOut'
      }, 0.15);

      tl.to(subtitleRef.current, {
        opacity: 1, y: 0, duration: 0.4, ease: 'power2.out'
      }, 0.55);
    });

    // ── MOBILE / TABLET <1024px: Sequential side-card inward slide ────────
    mm.add('(max-width: 1023px)', () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        // Just ensure everything is visible
        gsap.set([mobileLeftRef.current, mobileRightRef.current, mobileSubRef.current], { clearProps: 'all' });
        return;
      }

      // Hero text entrance
      gsap.from(heroOverlayRef.current, {
        opacity: 0, y: 24, duration: 0.9, ease: 'power3.out', delay: 0.1, clearProps: 'all',
      });

      // Left card slides in from left when user scrolls past hero image
      gsap.fromTo(mobileLeftRef.current,
        { xPercent: -110, opacity: 0 },
        {
          xPercent: 0, opacity: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: mobileHeroRef.current,
            start: 'bottom 90%',
            end: 'bottom 40%',
            scrub: 1.2,
            invalidateOnRefresh: true,
          }
        }
      );

      // Right card slides in from right, slightly delayed
      gsap.fromTo(mobileRightRef.current,
        { xPercent: 110, opacity: 0 },
        {
          xPercent: 0, opacity: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: mobileHeroRef.current,
            start: 'bottom 80%',
            end: 'bottom 30%',
            scrub: 1.2,
            invalidateOnRefresh: true,
          }
        }
      );

      // Subtitle fades in after both cards
      gsap.fromTo(mobileSubRef.current,
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: {
            trigger: mobileRightRef.current,
            start: 'bottom 80%',
            toggleActions: 'play none none none',
            once: true,
          }
        }
      );
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-white text-neutral-900 overflow-x-hidden">

      {/* ── MOBILE / TABLET Hero (<lg) ─────────────────────────────────────── */}
      <div className="lg:hidden flex flex-col" id="hero-mobile">

        {/* Full-height hero image with text overlay */}
        <div ref={mobileHeroRef} className="relative min-h-[100svh] flex flex-col">
          <img
            src={cottageImages.livingRoom}
            alt="Hill View living room with wood-burning stove"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

          {/* Mobile Hero Text + Booking Bar */}
          <div
            ref={heroOverlayRef}
            className="absolute inset-0 flex flex-col items-center justify-end px-5 pb-10 pt-24 text-center z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold uppercase tracking-widest mb-4">
              <Sparkles className="w-3 h-3 text-white/90" />
              <span>Low Row • Swaledale</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif-editorial font-medium tracking-tight text-white drop-shadow-md leading-[1.1] mb-3">
              Spacious Yorkshire Dales Stone Cottage
            </h1>
            <p className="text-base sm:text-lg font-serif-editorial italic text-white/90 font-light mb-8">
              Book direct with us and save!
            </p>

            {/* Mobile Booking Bar */}
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  onClick={onOpenBooking}
                  className="flex flex-col items-start px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left min-h-[48px] transition-all active:scale-[0.98]"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">Arrival</span>
                  <span className="text-sm font-medium text-white">{arrivalDate || '24 Sep 2026'}</span>
                </button>
                <button
                  onClick={onOpenBooking}
                  className="flex flex-col items-start px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-left min-h-[48px] transition-all active:scale-[0.98]"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 block">Departure</span>
                  <span className="text-sm font-medium text-white">{departureDate || '28 Sep 2026'}</span>
                </button>
              </div>
              <button
                onClick={onOpenBooking}
                className="w-full py-4 rounded-xl bg-white text-neutral-900 font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all min-h-[48px]"
              >
                <Search className="w-4 h-4" />
                <span>Check Availability</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile inward-slide card strip (animates on scroll) ── */}
        <div className="flex flex-col gap-0 bg-white overflow-hidden">

          {/* Left card — slides in from left */}
          <div
            ref={mobileLeftRef}
            className="relative w-full aspect-[16/9] will-change-transform"
            style={{ transform: 'translateX(-110%)', opacity: 0 }}
          >
            <img
              src={cottageImages.hero}
              alt="Hill View stone cottage exterior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md px-3 py-1 rounded-full bg-black/50 border border-white/20">
              Low Row Exterior
            </span>
          </div>

          {/* Right card — slides in from right */}
          <div
            ref={mobileRightRef}
            className="relative w-full aspect-[16/9] will-change-transform"
            style={{ transform: 'translateX(110%)', opacity: 0 }}
          >
            <img
              src={cottageImages.terrace}
              alt="Swaledale terrace views"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <span className="absolute bottom-3 left-3 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md px-3 py-1 rounded-full bg-black/50 border border-white/20">
              Swaledale Terrace
            </span>
          </div>

          {/* Subtitle reveal */}
          <div
            ref={mobileSubRef}
            className="px-5 py-8 text-center"
            style={{ opacity: 0, transform: 'translateY(16px)' }}
          >
            <p className="text-lg sm:text-xl font-serif-editorial italic text-neutral-600 leading-relaxed">
              A spacious Yorkshire Dales stone cottage.<br />Book direct with us and save.
            </p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP Hero (≥lg): Pinned 5-card mosaic ──────────────────────── */}
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
                className="absolute inset-0 flex flex-col items-center justify-between px-6 pt-40 pb-16 max-w-4xl mx-auto text-center z-10"
              >
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
                <div className="w-full max-w-3xl glass-panel rounded-3xl p-4 md:p-6 shadow-2xl border border-white/20 backdrop-blur-xl">
                  <form onSubmit={(e) => { e.preventDefault(); onOpenBooking(); }} className="flex items-end gap-4">
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
                    <button type="submit" className="px-8 py-3.5 rounded-full bg-white hover:bg-neutral-200 text-neutral-900 font-semibold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2 active:scale-95 min-h-[44px]">
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </button>
                  </form>
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
