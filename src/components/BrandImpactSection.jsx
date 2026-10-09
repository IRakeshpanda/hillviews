import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MapPin, Users } from 'lucide-react';
import { cottageImages } from '../data/cottageData';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function BrandImpactSection() {
  const sectionRef = useRef(null);
  const textLayerRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);

  useGSAP(() => {
    // Respect reduced motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const leftCard = leftCardRef.current;
    const rightCard = rightCardRef.current;
    const textLayer = textLayerRef.current;

    // Calculate initial offscreen offset so only 15% of the card is visible at the edge
    const calculateInitialOffsets = () => {
      const screenWidth = window.innerWidth;
      const cardWidth = leftCard ? leftCard.offsetWidth : screenWidth * 0.32;
      // Distance from screen center to screen edge minus 15% of card width
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

    // Set initial state: cards pushed to edges (15% peeking in) -> sliding inward to x: 0
    tl.fromTo(
      leftCard,
      { x: () => -calculateInitialOffsets() },
      { x: 0, ease: 'none' },
      0
    )
    .fromTo(
      rightCard,
      { x: () => calculateInitialOffsets() },
      { x: 0, ease: 'none' },
      0
    )
    // Fade out center text as cards slide over
    .to(
      textLayer,
      { opacity: 0.1, scale: 0.95, ease: 'none' },
      0.15
    );

  }, { scope: sectionRef });

  return (
    <section id="cottage" className="bg-white text-neutral-900">
      
      {/* Section 2: Pinned Dual-Card Horizontal Cover Reveal (Flex Centered Layout) */}
      <div 
        ref={sectionRef} 
        id="section-welcome"
        className="relative w-full h-screen overflow-hidden bg-white flex items-center justify-center"
      >
        {/* 1. Center Text Layer (z-10) */}
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

        {/* 2. Dual Cards Centered Wrapper (z-20) */}
        <div className="welcome-cards-wrapper absolute inset-0 z-20 flex items-center justify-center pointer-events-none gap-8 md:gap-10">
          
          {/* Left Card */}
          <div 
            ref={leftCardRef}
            className="left-reveal-card w-[70vw] sm:w-[42vw] lg:w-[32vw] aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl pointer-events-auto border border-neutral-200/60 relative group will-change-transform flex-shrink-0"
          >
            <img
              src={cottageImages.hero}
              alt="Hill View Exterior"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/80 border border-black/5 text-neutral-900 flex items-center gap-1.5 shadow-lg">
                <MapPin className="w-3.5 h-3.5 text-neutral-600" />
                <span>Low Row, Swaledale</span>
              </span>
            </div>
          </div>

          {/* Right Card */}
          <div 
            ref={rightCardRef}
            className="right-reveal-card w-[70vw] sm:w-[42vw] lg:w-[32vw] aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl pointer-events-auto border border-neutral-200/60 relative group will-change-transform flex-shrink-0"
          >
            <img
              src={cottageImages.livingRoom}
              alt="Hill View Living Room"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
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

      {/* Narrative Section Intro (Post-Reveal Flow) */}
      <div className="px-6 py-24 md:px-12 md:py-32 lg:px-20 lg:py-36 max-w-4xl mx-auto text-center border-t border-neutral-200/60">
        <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold block mb-6">
          DISCOVER YOUR PERFECT RETREAT
        </span>
        <p className="text-2xl md:text-3xl lg:text-4xl font-serif-editorial font-light leading-relaxed text-neutral-600">
          Discover the beauty of the Yorkshire Dales with a stay at <strong className="font-semibold text-neutral-900">Hill View</strong>, a recently refurbished stone cottage nestled in the tranquil village of Low Row in Swaledale. Perfect for families, couples, friends and lovers of the great outdoors.
        </p>
      </div>

    </section>
  );
}
