import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MapPin, Users } from 'lucide-react';
import { cottageImages } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function BrandImpactSection() {
  // Desktop refs
  const sectionRef   = useRef(null);
  const textLayerRef = useRef(null);
  const leftCardRef  = useRef(null);
  const rightCardRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // ── DESKTOP ≥1024px: Pinned dual-card horizontal cover reveal ─────────
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const leftCard  = leftCardRef.current;
      const rightCard = rightCardRef.current;
      const textLayer = textLayerRef.current;

      if (!leftCard || !rightCard || !textLayer) return;

      const calculateInitialOffsets = () => {
        const screenWidth = window.innerWidth;
        const cardWidth   = leftCard.offsetWidth || screenWidth * 0.32;
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

    // ── MOBILE / TABLET <1024px: Pinned scrub dual-card vertical cover ────
    mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
      const sec2Trigger    = document.querySelector('#welcome-mobile-section');
      const sec2TopCard    = document.querySelector('.welcome-mobile-top-card');
      const sec2BottomCard = document.querySelector('.welcome-mobile-bottom-card');
      const sec2Text       = document.querySelector('.welcome-mobile-text-layer');

      if (!sec2Trigger || !sec2TopCard || !sec2BottomCard) return;

      const mobileSec2Tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec2Trigger,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // Top card covers top half from left
      mobileSec2Tl.fromTo(sec2TopCard,
        { x: '-105vw' },
        { x: 0, ease: 'none' },
        0
      );

      // Bottom card covers bottom half from right
      mobileSec2Tl.fromTo(sec2BottomCard,
        { x: '105vw' },
        { x: 0, ease: 'none' },
        0.15
      );

      // Text fades out as cards meet in center
      if (sec2Text) {
        mobileSec2Tl.to(sec2Text,
          { opacity: 0.1, scale: 0.95, ease: 'none' },
          0.1
        );
      }

      ScrollTrigger.refresh();
    });

    // Reduced motion fallback
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(
        [leftCardRef.current, rightCardRef.current, textLayerRef.current].filter(Boolean),
        { clearProps: 'all' }
      );
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section id="cottage" className="bg-white text-neutral-900 overflow-x-hidden">

      {/* ══ MOBILE (<lg): Pinned dual-card split cover ═══════════════════════ */}
      <section
        id="welcome-mobile-section"
        className="lg:hidden relative w-full h-screen overflow-hidden bg-white flex items-center justify-center"
      >
        {/* 1. Center Text Block */}
        <div className="welcome-mobile-text-layer absolute inset-0 z-10 flex flex-col justify-center items-center text-center px-6">
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold mb-4 block">
            WELCOME TO HILL VIEW
          </span>
          <h2
            className="font-serif-editorial font-bold tracking-tight text-neutral-900 leading-snug"
            style={{ fontSize: 'clamp(2rem, 7vw, 3rem)' }}
          >
            Welcome to<br />Hill View.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 max-w-xs font-serif-editorial italic">
            Discover the beauty of the Yorkshire Dales with a stay at Hill View, a recently refurbished stone cottage nestled in Low Row.
          </p>
        </div>

        {/* 2. Dual Cover Cards Layer */}
        <div className="welcome-mobile-cards-layer absolute inset-0 z-20 flex flex-col justify-center items-center gap-3 p-4 pointer-events-none">

          {/* Top Half Card — slides from left */}
          <div className="welcome-mobile-top-card w-full h-[38vh] rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 border border-neutral-200 will-change-transform">
            <img
              src={cottageImages.hero}
              alt="Hill View Exterior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1.5 backdrop-blur-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/90 border border-black/5 text-neutral-900 shadow-md">
                <MapPin className="w-3 h-3 text-neutral-600" />
                Low Row, Swaledale
              </span>
            </div>
          </div>

          {/* Bottom Half Card — slides from right */}
          <div className="welcome-mobile-bottom-card w-full h-[38vh] rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 border border-neutral-200 will-change-transform">
            <img
              src={cottageImages.livingRoom}
              alt="Hill View Living Room"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1.5 backdrop-blur-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/90 border border-black/5 text-neutral-900 shadow-md">
                <Users className="w-3 h-3 text-neutral-600" />
                Sleeps up to 8
              </span>
            </div>
          </div>

        </div>
      </section>

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
