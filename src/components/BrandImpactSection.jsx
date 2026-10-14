import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MapPin, Users } from 'lucide-react';
import { cottageImages } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function BrandImpactSection() {
  const sectionRef     = useRef(null);
  const textLayerRef   = useRef(null);
  const leftCardRef    = useRef(null);
  const rightCardRef   = useRef(null);

  // Mobile-specific refs
  const mobileSectionRef  = useRef(null);
  const mobileTextRef     = useRef(null);
  const mobileLeftRef     = useRef(null);
  const mobileRightRef    = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // ── DESKTOP ≥1024px: Pinned dual-card horizontal cover reveal ─────────
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const leftCard  = leftCardRef.current;
      const rightCard = rightCardRef.current;
      const textLayer = textLayerRef.current;

      const calculateInitialOffsets = () => {
        const screenWidth = window.innerWidth;
        const cardWidth   = leftCard ? leftCard.offsetWidth : screenWidth * 0.32;
        return (screenWidth / 2) + (cardWidth * 0.35);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      tl.fromTo(leftCard,  { x: () => -calculateInitialOffsets() }, { x: 0, ease: 'none' }, 0)
        .fromTo(rightCard, { x: () =>  calculateInitialOffsets() }, { x: 0, ease: 'none' }, 0)
        .to(textLayer,     { opacity: 0.1, scale: 0.95, ease: 'none' }, 0.15);
    });

    // ── MOBILE / TABLET <1024px: Pinned vertical card cover sequence ───────
    mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mobileSectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // Text fades out as cards cover it
      tl.to(mobileTextRef.current, { opacity: 0.08, scale: 0.96, ease: 'none' }, 0);

      // Left card slides in from left covering top-half of the section
      tl.fromTo(mobileLeftRef.current,
        { xPercent: -110 },
        { xPercent: 0, ease: 'none' },
        0
      );

      // Right card slides in from right with slight offset, covering bottom-half
      tl.fromTo(mobileRightRef.current,
        { xPercent: 110 },
        { xPercent: 0, ease: 'none' },
        0.1
      );
    });

    // Reduced-motion fallback
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set([leftCardRef.current, rightCardRef.current, textLayerRef.current,
                mobileLeftRef.current, mobileRightRef.current], { clearProps: 'all' });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section id="cottage" className="bg-white text-neutral-900 overflow-x-hidden">

      {/* ══ MOBILE / TABLET (<lg): Pinned cover reveal ═══════════════════════ */}
      <div
        ref={mobileSectionRef}
        id="section-welcome-mobile"
        className="lg:hidden relative w-full h-screen overflow-hidden bg-white flex items-center justify-center"
      >
        {/* Centre Text Layer */}
        <div
          ref={mobileTextRef}
          className="sec2-mobile-text absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          <h2
            className="font-serif-editorial font-bold tracking-tight text-neutral-900 max-w-xs"
            style={{ fontSize: 'clamp(2rem, 7vw, 3rem)' }}
          >
            Welcome to Hill View.
          </h2>
          <p className="mt-3 text-sm sm:text-base font-serif-editorial italic text-neutral-600 max-w-xs leading-relaxed">
            A recently refurbished stone cottage nestled in the tranquil village of Low Row.
          </p>
        </div>

        {/* Left card — covers top half of viewport */}
        <div
          ref={mobileLeftRef}
          className="sec2-mobile-left-card absolute top-0 left-0 w-full h-1/2 z-20 overflow-hidden will-change-transform"
          style={{ transform: 'translateX(-110%)' }}
        >
          <img
            src={cottageImages.hero}
            alt="Hill View Exterior"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
          <div className="absolute bottom-4 left-4">
            <span className="backdrop-blur-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/80 border border-black/5 text-neutral-900 flex items-center gap-1.5 shadow-md">
              <MapPin className="w-3 h-3 text-neutral-600" />
              <span>Low Row, Swaledale</span>
            </span>
          </div>
        </div>

        {/* Right card — covers bottom half of viewport */}
        <div
          ref={mobileRightRef}
          className="sec2-mobile-right-card absolute bottom-0 left-0 w-full h-1/2 z-20 overflow-hidden will-change-transform"
          style={{ transform: 'translateX(110%)' }}
        >
          <img
            src={cottageImages.livingRoom}
            alt="Hill View Living Room"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/40" />
          <div className="absolute top-4 left-4">
            <span className="backdrop-blur-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/80 border border-black/5 text-neutral-900 flex items-center gap-1.5 shadow-md">
              <Users className="w-3 h-3 text-neutral-600" />
              <span>Sleeps up to 8</span>
            </span>
          </div>
        </div>
      </div>

      {/* ══ DESKTOP (≥lg): Pinned Dual-Card Horizontal Cover Reveal ══════════ */}
      <div
        ref={sectionRef}
        id="section-welcome"
        className="hidden lg:flex relative w-full h-screen overflow-hidden bg-white items-center justify-center"
      >
        {/* Center Text Layer */}
        <div
          ref={textLayerRef}
          className="welcome-text-layer absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
        >
          <h2
            className="font-serif-editorial font-bold tracking-tight text-neutral-900 drop-shadow-sm max-w-4xl"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.25rem)' }}
          >
            Welcome to Hill View.
          </h2>
          <p className="mt-4 text-base md:text-xl font-serif-editorial italic text-neutral-600 max-w-xl">
            Discover the beauty of the Yorkshire Dales with a stay at Hill View, a recently refurbished stone cottage nestled in the tranquil village of Low Row.
          </p>
        </div>

        {/* Dual Cards */}
        <div className="welcome-cards-wrapper absolute inset-0 z-20 flex items-center justify-center pointer-events-none gap-10">
          <div
            ref={leftCardRef}
            className="left-reveal-card w-[32vw] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl pointer-events-auto border border-neutral-200/60 relative group will-change-transform flex-shrink-0"
          >
            <img src={cottageImages.hero} alt="Hill View Exterior" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/80 border border-black/5 text-neutral-900 flex items-center gap-1.5 shadow-lg">
                <MapPin className="w-3.5 h-3.5 text-neutral-600" />
                <span>Low Row, Swaledale</span>
              </span>
            </div>
          </div>

          <div
            ref={rightCardRef}
            className="right-reveal-card w-[32vw] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl pointer-events-auto border border-neutral-200/60 relative group will-change-transform flex-shrink-0"
          >
            <img src={cottageImages.livingRoom} alt="Hill View Living Room" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/80 border border-black/5 text-neutral-900 flex items-center gap-1.5 shadow-lg">
                <Users className="w-3.5 h-3.5 text-neutral-600" />
                <span>Sleeps up to 8</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ Narrative Intro (Shared) ══════════════════════════════════════════ */}
      <div className="px-6 py-16 sm:py-20 md:py-24 lg:py-36 md:px-12 lg:px-20 max-w-4xl mx-auto text-center border-t border-neutral-200/60">
        <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold block mb-6">
          DISCOVER YOUR PERFECT RETREAT
        </span>
        <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif-editorial font-light leading-relaxed text-neutral-600">
          Discover the beauty of the Yorkshire Dales with a stay at{' '}
          <strong className="font-semibold text-neutral-900">Hill View</strong>, a recently refurbished stone cottage nestled in the tranquil village of Low Row in Swaledale. Perfect for families, couples, friends and lovers of the great outdoors.
        </p>
      </div>

    </section>
  );
}
