import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Sparkles } from 'lucide-react';
import { cottageImages } from '../data/cottageData';
import { getImageSrcSet } from '../utils/imageUtils';
import SmoobuBookingEmbed from './SmoobuBookingEmbed';
import BookingSearchForm from './BookingSearchForm';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  return isDesktop;
}

export default function HeroSection({ onOpenBooking, arrivalDate, departureDate, guests }) {
  const isDesktop = useIsDesktop();
  const containerRef = useRef(null);

  // Desktop entrance & scroll refs
  const heroOverlayRef = useRef(null);
  const centerCardRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const mosaicWrapperRef = useRef(null);
  const subtitleRevealRef = useRef(null);

  const desktopBgRef = useRef(null);
  const desktopBadgeRef = useRef(null);
  const desktopHeadingRef = useRef(null);
  const desktopSubRef = useRef(null);
  const desktopBookingRef = useRef(null);

  // Mobile refs
  const mobileBgRef = useRef(null);
  const mobileBadgeRef = useRef(null);
  const mobileHeadingRef = useRef(null);
  const mobileSubRefText = useRef(null);
  const mobileBookingRef = useRef(null);
  const mobileLeftCardRef = useRef(null);
  const mobileRightCardRef = useRef(null);
  const mobileSubRef = useRef(null);
  const mobileTrackRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const siteNavbar = document.getElementById('site-navbar');

    // ── 1. HERO ENTRANCE ANIMATION (Calm, elegant, ~1.5–1.6s sequence) ─────
    if (prefersReducedMotion) {
      gsap.set(
        [
          desktopBgRef.current,
          mobileBgRef.current,
          siteNavbar,
          desktopBadgeRef.current,
          desktopHeadingRef.current,
          desktopSubRef.current,
          desktopBookingRef.current,
          mobileBadgeRef.current,
          mobileHeadingRef.current,
          mobileSubRefText.current,
          mobileBookingRef.current,
        ].filter(Boolean),
        {
          opacity: 1,
          y: 0,
          scale: 1,
          clearProps: 'transform,opacity',
        }
      );
    } else {
      const entranceTl = gsap.timeline({
        defaults: { ease: 'power2.out' },
      });

      // Background image: subtle fade-in & gentle zoom-out over 1.4s
      const bgElements = [desktopBgRef.current, mobileBgRef.current].filter(Boolean);
      if (bgElements.length) {
        entranceTl.fromTo(
          bgElements,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' },
          0
        );
      }

      // Navbar: gently slides upward from a slightly lower position (+12px) while fading in
      // Animating ONLY opacity and vertical offset, keeping its horizontal position fixed throughout
      if (siteNavbar) {
        entranceTl.fromTo(
          siteNavbar,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out', clearProps: 'transform' },
          0.15
        );
      }

      // Location badges: gentle upward movement (+12px -> 0)
      const badges = [desktopBadgeRef.current, mobileBadgeRef.current].filter(Boolean);
      if (badges.length) {
        entranceTl.fromTo(
          badges,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
          0.30
        );
      }

      // Main headings: gentle upward movement (+14px -> 0)
      const headings = [desktopHeadingRef.current, mobileHeadingRef.current].filter(Boolean);
      if (headings.length) {
        entranceTl.fromTo(
          headings,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
          0.45
        );
      }

      // Subtitles: gentle upward movement (+12px -> 0)
      const subtitles = [desktopSubRef.current, mobileSubRefText.current].filter(Boolean);
      if (subtitles.length) {
        entranceTl.fromTo(
          subtitles,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
          0.60
        );
      }

      // Booking containers: reveal last with a soft fade-up (+14px -> 0)
      const bookingContainers = [desktopBookingRef.current, mobileBookingRef.current].filter(Boolean);
      if (bookingContainers.length) {
        entranceTl.fromTo(
          bookingContainers,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.95, ease: 'power2.out' },
          0.75
        );
      }
    }

    const mm = gsap.matchMedia();

    // ── 2. DESKTOP ≥1024px: Pinned 5-card mosaic expansion on scroll ───────
    mm.add('(min-width: 1024px)', () => {
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
      tl.to(leftColRef.current, { width: '28%', xPercent: 0, opacity: 1, duration: 0.65, ease: 'power2.inOut' }, 0.15);
      tl.to(rightColRef.current, { width: '28%', xPercent: 0, opacity: 1, duration: 0.65, ease: 'power2.inOut' }, 0.15);
      tl.to(subtitleRevealRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.55);
    });

    // ── 3. MOBILE / TABLET <1024px: Sequential slide-in on scroll ─────────
    mm.add('(max-width: 1023px)', () => {
      const leftCard = mobileLeftCardRef.current;
      const rightCard = mobileRightCardRef.current;
      const subtitle = mobileSubRef.current;

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
              ref={mobileBgRef}
              src="/images/gardens/yorkshire-dales-hill-view-out-side.webp"
              srcSet="/images/gardens/yorkshire-dales-hill-view-out-side-640w.webp 640w, /images/gardens/yorkshire-dales-hill-view-out-side-1024w.webp 1024w, /images/gardens/yorkshire-dales-hill-view-out-side-1600w.webp 1600w, /images/gardens/yorkshire-dales-hill-view-out-side.webp 2400w"
              sizes="100vw"
              alt="Hill View 18th-century stone cottage exterior in Low Row, Swaledale"
              className="w-full h-full object-cover brightness-[0.82]"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/75" />
          </div>

          <div className="relative z-10 w-full max-w-sm px-6 text-center text-white flex flex-col items-center justify-center">
            <span
              ref={mobileBadgeRef}
              className="text-[11px] uppercase tracking-[0.25em] text-neutral-300 font-semibold mb-2"
            >
              Swaledale • Yorkshire Dales
            </span>
            <h1
              ref={mobileHeadingRef}
              className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
            >
              Charming Yorkshire Dales Stone Cottage
            </h1>
            <p
              ref={mobileSubRefText}
              className="mt-2 text-xs sm:text-sm text-neutral-200 font-light italic text-amber-200/90"
            >
              Book direct with us and save.
            </p>

            {/* Custom Mobile Booking Search Form */}
            <div
              ref={mobileBookingRef}
              className="mt-6 w-full max-w-md mx-auto rounded-2xl bg-transparent backdrop-blur-xl border border-white/30 shadow-2xl overflow-hidden p-2.5 sm:p-3 text-neutral-900 text-left"
            >
              {!isDesktop && (
                <BookingSearchForm variant="mobile-hero" buttonLabel="Check Dates" />
              )}
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
            <img
              src="/images/living/hill-view-2026-indoor-bonfire-and-lamp.webp"
              srcSet="/images/living/hill-view-2026-indoor-bonfire-and-lamp-640w.webp 640w, /images/living/hill-view-2026-indoor-bonfire-and-lamp-1024w.webp 1024w, /images/living/hill-view-2026-indoor-bonfire-and-lamp.webp 2400w"
              sizes="100vw"
              alt="Hill View living room with cosy wood-burning stove and stone hearth"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
              Beamed Living Room
            </span>
          </div>

          <div
            ref={mobileRightCardRef}
            className="hero-mob-card-right relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-neutral-200/80 bg-neutral-100"
          >
            <img
              src="/images/kitchen/hill-view-2026-food-dine-elegant-view.webp"
              srcSet="/images/kitchen/hill-view-2026-food-dine-elegant-view-640w.webp 640w, /images/kitchen/hill-view-2026-food-dine-elegant-view-1024w.webp 1024w, /images/kitchen/hill-view-2026-food-dine-elegant-view.webp 2400w"
              sizes="100vw"
              alt="Country dining room with farmhouse table set for a meal"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium">
              Dining room
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
                <img
                  src={cottageImages.hero}
                  srcSet={getImageSrcSet(cottageImages.hero)}
                  sizes="33vw"
                  alt="Hill View stone cottage exterior in Low Row, Swaledale"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md px-3 py-1 rounded-full bg-black/50 border border-white/20">Low Row Exterior</span>
              </div>
              <div className="relative flex-1 overflow-hidden rounded-3xl border border-neutral-200/60 shadow-2xl group">
                <img
                  src={cottageImages.terrace}
                  srcSet={getImageSrcSet(cottageImages.terrace)}
                  sizes="33vw"
                  alt="Terrace overlooking the Yorkshire Dales fells"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
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
              <img
                ref={desktopBgRef}
                src={cottageImages.livingRoom}
                srcSet={getImageSrcSet(cottageImages.livingRoom)}
                sizes="100vw"
                alt="Hill View living room with cosy wood-burning stove and stone hearth"
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />

              <div
                ref={heroOverlayRef}
                className="absolute inset-0 z-10 flex items-center justify-center px-6 py-12"
              >
                <div className="w-full max-w-5xl text-center flex flex-col items-center justify-center">
                  <div className="space-y-4">
                    <div
                      ref={desktopBadgeRef}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium uppercase tracking-widest shadow-lg"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white/90" />
                      <span>Low Row • Swaledale</span>
                    </div>
                    <h1
                      ref={desktopHeadingRef}
                      className="text-5xl lg:text-6xl xl:text-7xl font-serif-editorial font-medium tracking-tight text-white drop-shadow-md leading-[1.08]"
                    >
                      Charming Yorkshire Dales Stone Cottage
                    </h1>
                    <p
                      ref={desktopSubRef}
                      className="text-xl lg:text-2xl font-serif-editorial italic text-white/90 font-light drop-shadow"
                    >
                      Book direct with us and save!
                    </p>
                  </div>

                  {/* Custom Desktop Booking Search Bar */}
                  <div
                    ref={desktopBookingRef}
                    className="mt-8 w-full max-w-4xl rounded-3xl bg-transparent backdrop-blur-xl border border-white/30 shadow-2xl overflow-hidden p-3 md:p-5 text-neutral-900"
                  >
                    {isDesktop && (
                      <BookingSearchForm variant="hero" buttonLabel="Check Dates" />
                    )}
                  </div>
                </div>
              </div>

              <div
                ref={subtitleRevealRef}
                className="hero-mosaic-reveal-text absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center opacity-0 translate-y-6 w-full max-w-2xl px-6 pointer-events-none"
              >
                <p className="text-2xl lg:text-3xl font-serif-editorial italic text-neutral-200 drop-shadow-sm">
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
                <img
                  src={cottageImages.diningRoom}
                  srcSet={getImageSrcSet(cottageImages.diningRoom)}
                  sizes="33vw"
                  alt="Country dining room with farmhouse table set for dinner"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md px-3 py-1 rounded-full bg-black/50 border border-white/20">Beamed Dining</span>
              </div>
              <div className="relative flex-1 overflow-hidden rounded-3xl border border-neutral-200/60 shadow-2xl group">
                <img
                  src={cottageImages.beamedDouble}
                  srcSet={getImageSrcSet(cottageImages.beamedDouble)}
                  sizes="33vw"
                  alt="Cosy double bedroom with exposed oak beams"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
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
